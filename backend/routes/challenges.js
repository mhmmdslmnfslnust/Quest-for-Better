const express = require('express');
const db = require('../models/database');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get all active challenges
router.get('/', asyncHandler(async (req, res) => {
    try {
        const challenges = await db.query(`
            SELECT * FROM challenges
            WHERE is_active = 1
            ORDER BY duration_days ASC
        `);
        
        successResponse(res, challenges);
    } catch (error) {
        console.error('Fetch challenges error:', error);
        errorResponse(res, 500, 'Failed to fetch challenges');
    }
}));

// Get user's active challenges
router.get('/user', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userChallenges = await db.query(`
            SELECT c.*, uc.started_at, uc.completed_at, uc.current_progress, uc.is_completed,
                   CASE 
                       WHEN uc.is_completed = 1 THEN 'completed'
                       WHEN datetime(uc.started_at, '+' || c.duration_days || ' days') < datetime('now') THEN 'expired'
                       ELSE 'active'
                   END as status
            FROM challenges c
            JOIN user_challenges uc ON c.id = uc.challenge_id
            WHERE uc.user_id = ?
            ORDER BY uc.started_at DESC
        `, [req.user.id]);
        
        successResponse(res, userChallenges);
    } catch (error) {
        console.error('Fetch user challenges error:', error);
        errorResponse(res, 500, 'Failed to fetch user challenges');
    }
}));

// Join a challenge
router.post('/:id/join', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userId = req.user.id;
        
        // Check if challenge exists and is active
        const challenge = await db.get(`
            SELECT * FROM challenges WHERE id = ? AND is_active = 1
        `, [challengeId]);
        
        if (!challenge) {
            return errorResponse(res, 404, 'Challenge not found or inactive');
        }
        
        // Check if user already joined this challenge
        const existingChallenge = await db.get(`
            SELECT * FROM user_challenges 
            WHERE user_id = ? AND challenge_id = ?
        `, [userId, challengeId]);
        
        if (existingChallenge) {
            return errorResponse(res, 400, 'Already joined this challenge');
        }
        
        // Join the challenge
        await db.run(`
            INSERT INTO user_challenges (user_id, challenge_id)
            VALUES (?, ?)
        `, [userId, challengeId]);
        
        successResponse(res, null, 'Successfully joined challenge');
    } catch (error) {
        console.error('Join challenge error:', error);
        errorResponse(res, 500, 'Failed to join challenge');
    }
}));

// Update challenge progress
router.post('/:id/progress', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userId = req.user.id;
        
        // Get user's challenge
        const userChallenge = await db.get(`
            SELECT uc.*, c.*
            FROM user_challenges uc
            JOIN challenges c ON uc.challenge_id = c.id
            WHERE uc.user_id = ? AND uc.challenge_id = ? AND uc.is_completed = 0
        `, [userId, challengeId]);
        
        if (!userChallenge) {
            return errorResponse(res, 404, 'Challenge not found or already completed');
        }
        
        // Check if challenge has expired
        const expiryDate = new Date(userChallenge.started_at);
        expiryDate.setDate(expiryDate.getDate() + userChallenge.duration_days);
        
        if (new Date() > expiryDate) {
            return errorResponse(res, 400, 'Challenge has expired');
        }
        
        // Update progress based on challenge type
        let newProgress = 0;
        
        switch (userChallenge.challenge_type) {
            case 'streak':
                // Get current streak
                const streakQuery = await db.get(`
                    SELECT current_streak FROM user_stats WHERE user_id = ?
                `, [userId]);
                newProgress = streakQuery ? streakQuery.current_streak : 0;
                break;
                
            case 'points_sprint':
                // Get points earned since challenge started
                const pointsQuery = await db.get(`
                    SELECT COALESCE(SUM(hl.points_earned), 0) as points
                    FROM habit_logs hl
                    JOIN habits h ON hl.habit_id = h.id
                    WHERE h.user_id = ? AND hl.logged_at >= ?
                `, [userId, userChallenge.started_at]);
                newProgress = pointsQuery ? pointsQuery.points : 0;
                break;
                
            case 'new_habits':
                // Count habits created since challenge started
                const habitsQuery = await db.get(`
                    SELECT COUNT(*) as count
                    FROM habits
                    WHERE user_id = ? AND created_at >= ?
                `, [userId, userChallenge.started_at]);
                newProgress = habitsQuery ? habitsQuery.count : 0;
                break;
                
            case 'perfect_month':
                // Count perfect days since challenge started
                const perfectDaysQuery = await db.get(`
                    WITH daily_completion AS (
                        SELECT 
                            hl.date,
                            COUNT(DISTINCT h.id) as total_habits,
                            COUNT(DISTINCT CASE WHEN hl.success = 1 THEN h.id END) as completed_habits
                        FROM habit_logs hl
                        JOIN habits h ON hl.habit_id = h.id
                        WHERE h.user_id = ? 
                        AND hl.date >= date(?)
                        GROUP BY hl.date
                    )
                    SELECT COUNT(*) as perfect_days
                    FROM daily_completion
                    WHERE total_habits = completed_habits AND total_habits > 0
                `, [userId, userChallenge.started_at.split('T')[0]]);
                newProgress = perfectDaysQuery ? perfectDaysQuery.perfect_days : 0;
                break;
        }
        
        // Check if challenge is completed
        const isCompleted = newProgress >= userChallenge.target_value;
        
        // Update progress
        await db.run(`
            UPDATE user_challenges
            SET current_progress = ?, 
                is_completed = ?,
                completed_at = CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE NULL END
            WHERE user_id = ? AND challenge_id = ?
        `, [newProgress, isCompleted ? 1 : 0, isCompleted, userId, challengeId]);
        
        // Award points if completed
        if (isCompleted && userChallenge.current_progress < userChallenge.target_value) {
            await db.run(`
                UPDATE users 
                SET total_points = total_points + ?
                WHERE id = ?
            `, [userChallenge.reward_points, userId]);
        }
        
        successResponse(res, {
            progress: newProgress,
            target: userChallenge.target_value,
            completed: isCompleted,
            points_awarded: isCompleted ? userChallenge.reward_points : 0
        }, isCompleted ? 'Challenge completed!' : 'Progress updated');
        
    } catch (error) {
        console.error('Update challenge progress error:', error);
        errorResponse(res, 500, 'Failed to update challenge progress');
    }
}));

// Get challenge leaderboard
router.get('/:id/leaderboard', asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        
        const leaderboard = await db.query(`
            SELECT u.username, uc.current_progress, uc.is_completed, uc.completed_at,
                   CASE 
                       WHEN uc.is_completed = 1 THEN 'completed'
                       WHEN datetime(uc.started_at, '+' || c.duration_days || ' days') < datetime('now') THEN 'expired'
                       ELSE 'active'
                   END as status
            FROM user_challenges uc
            JOIN users u ON uc.user_id = u.id
            JOIN challenges c ON uc.challenge_id = c.id
            WHERE uc.challenge_id = ?
            ORDER BY uc.is_completed DESC, uc.current_progress DESC, uc.completed_at ASC
            LIMIT 20
        `, [challengeId]);
        
        successResponse(res, leaderboard);
    } catch (error) {
        console.error('Fetch challenge leaderboard error:', error);
        errorResponse(res, 500, 'Failed to fetch challenge leaderboard');
    }
}));

module.exports = router;
