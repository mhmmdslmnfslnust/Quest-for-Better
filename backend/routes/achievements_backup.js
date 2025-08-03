const express = require('express');
const db = require('../models/database');
const Achievement = require('../models/Achievement');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get all achievements
router.get('/', asyncHandler(async (req, res) => {
    try {
        const achievements = await Achievement.getAllAchievements();
        successResponse(res, achievements);
    } catch (error) {
        console.error('Fetch achievements error:', error);
        errorResponse(res, 500, 'Failed to fetch achievements');
    }
}));

// Get user's achievements
router.get('/user', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userAchievements = await Achievement.getUserAchievements(req.user.id);
        successResponse(res, userAchievements);
    } catch (error) {
        console.error('Fetch user achievements error:', error);
        errorResponse(res, 500, 'Failed to fetch user achievements');
    }
}));

// Get achievement progress for user
router.get('/progress', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const progress = await Achievement.getAchievementProgress(req.user.id);
        successResponse(res, progress);
    } catch (error) {
        console.error('Fetch achievement progress error:', error);
        errorResponse(res, 500, 'Failed to fetch achievement progress');
    }
}));

// Check and award achievements for a user
router.post('/check', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const newAchievements = await Achievement.checkAndAwardAchievements(req.user.id);
        successResponse(res, { 
            message: 'Achievements checked successfully',
            newAchievements,
            count: newAchievements.length
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        errorResponse(res, 500, 'Failed to check achievements');
    }
}));
        
        // Get user's current stats
        const userStats = await db.get(`
            SELECT u.*, us.*
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `, [userId]);

        if (!userStats) {
            return errorResponse(res, 404, 'User not found');
        }

        // Get all achievements user hasn't earned yet
        const availableAchievements = await db.query(`
            SELECT a.*
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE ua.id IS NULL
        `, [userId]);

        // Check each achievement condition
        for (const achievement of availableAchievements) {
            let conditionMet = false;
            
            switch (achievement.condition_type) {
                case 'total_points':
                    conditionMet = userStats.total_points >= achievement.condition_value;
                    break;
                    
                case 'user_level':
                    conditionMet = userStats.level >= achievement.condition_value;
                    break;
                    
                case 'streak_days':
                    conditionMet = userStats.current_streak >= achievement.condition_value;
                    break;
                    
                case 'habit_logs':
                    const logCount = await db.get(`
                        SELECT COUNT(*) as count
                        FROM habit_logs hl
                        JOIN habits h ON hl.habit_id = h.id
                        WHERE h.user_id = ?
                    `, [userId]);
                    conditionMet = logCount.count >= achievement.condition_value;
                    break;
                    
                case 'habits_created':
                    const habitCount = await db.get(`
                        SELECT COUNT(*) as count
                        FROM habits
                        WHERE user_id = ?
                    `, [userId]);
                    conditionMet = habitCount.count >= achievement.condition_value;
                    break;
                    
                case 'weekend_logs':
                    const weekendLogs = await db.get(`
                        SELECT COUNT(DISTINCT hl.date) as count
                        FROM habit_logs hl
                        JOIN habits h ON hl.habit_id = h.id
                        WHERE h.user_id = ? 
                        AND hl.success = 1
                        AND (strftime('%w', hl.date) = '0' OR strftime('%w', hl.date) = '6')
                        AND hl.date >= date('now', '-7 days')
                    `, [userId]);
                    conditionMet = weekendLogs.count >= achievement.condition_value;
                    break;
                    
                case 'perfect_week':
                    // Check if user completed all their habits every day for the past week
                    const perfectWeekCheck = await db.get(`
                        WITH daily_habit_counts AS (
                            SELECT 
                                hl.date,
                                COUNT(DISTINCT h.id) as habits_for_day,
                                COUNT(DISTINCT CASE WHEN hl.success = 1 THEN h.id END) as completed_for_day
                            FROM habit_logs hl
                            JOIN habits h ON hl.habit_id = h.id
                            WHERE h.user_id = ?
                            AND hl.date >= date('now', '-7 days')
                            GROUP BY hl.date
                        )
                        SELECT 
                            COUNT(*) as perfect_days,
                            COUNT(DISTINCT date) as total_days
                        FROM daily_habit_counts
                        WHERE habits_for_day = completed_for_day
                    `, [userId]);
                    conditionMet = perfectWeekCheck.perfect_days >= 7 && perfectWeekCheck.total_days >= 7;
                    break;
            }
            
            if (conditionMet) {
                // Award the achievement
                try {
                    await db.run(`
                        INSERT INTO user_achievements (user_id, achievement_id)
                        VALUES (?, ?)
                    `, [userId, achievement.id]);
                    
                    // Award points
                    await db.run(`
                        UPDATE users 
                        SET total_points = total_points + ?
                        WHERE id = ?
                    `, [achievement.points_reward, userId]);
                    
                    newAchievements.push(achievement);
                } catch (error) {
                    // Achievement might already exist (race condition)
                    console.log('Achievement already awarded:', achievement.id);
                }
            }
        }
        
        successResponse(res, newAchievements, 'Achievements checked successfully');
    } catch (error) {
        console.error('Check achievements error:', error);
        errorResponse(res, 500, 'Failed to check achievements');
    }
}));

// Get achievement progress for user
router.get('/progress', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user stats
        const userStats = await db.get(`
            SELECT u.*, us.*
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `, [userId]);

        // Get all achievements with progress
        const achievements = await db.query(`
            SELECT a.*, 
                   ua.earned_at,
                   CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as earned
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE a.is_secret = 0 OR ua.id IS NOT NULL
            ORDER BY earned DESC, a.category, a.points_reward ASC
        `, [userId]);

        // Calculate progress for each achievement
        const achievementsWithProgress = achievements.map(achievement => {
            let currentValue = 0;
            let progress = 0;

            if (!achievement.earned) {
                switch (achievement.condition_type) {
                    case 'total_points':
                        currentValue = userStats.total_points;
                        break;
                    case 'user_level':
                        currentValue = userStats.level;
                        break;
                    case 'streak_days':
                        currentValue = userStats.current_streak;
                        break;
                    case 'habit_logs':
                        currentValue = userStats.total_habits_completed;
                        break;
                }
                
                progress = Math.min((currentValue / achievement.condition_value) * 100, 100);
            } else {
                progress = 100;
                currentValue = achievement.condition_value;
            }

            return {
                ...achievement,
                current_value: currentValue,
                progress: Math.round(progress)
            };
        });
        
        successResponse(res, achievementsWithProgress);
    } catch (error) {
        console.error('Fetch achievement progress error:', error);
        errorResponse(res, 500, 'Failed to fetch achievement progress');
    }
}));

module.exports = router;
