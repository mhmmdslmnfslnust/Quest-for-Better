const express = require('express');
const db = require('../models/database');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get user dashboard stats
router.get('/dashboard', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get basic user stats
        const userStats = await db.get(`
            SELECT u.total_points, u.level, us.*
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `, [userId]);
        
        // Get today's habits status
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await db.get(`
            WITH today_habits AS (
                SELECT h.id,
                       CASE WHEN hl.success IS NOT NULL THEN 1 ELSE 0 END as logged,
                       COALESCE(hl.success, 0) as completed
                FROM habits h
                LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.date = ?
                WHERE h.user_id = ? AND h.is_active = 1
            )
            SELECT 
                COUNT(*) as total_habits,
                SUM(logged) as logged_habits,
                SUM(completed) as completed_habits
            FROM today_habits
        `, [today, userId]);
        
        // Get weekly progress
        const weeklyStats = await db.get(`
            SELECT 
                COUNT(DISTINCT hl.date) as active_days,
                COUNT(*) as total_logs,
                SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                SUM(hl.points_earned) as points_this_week
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ? 
            AND hl.date >= date('now', '-7 days')
        `, [userId]);
        
        // Get achievements count
        const achievementsCount = await db.get(`
            SELECT COUNT(*) as count
            FROM user_achievements
            WHERE user_id = ?
        `, [userId]);
        
        // Get active challenges count
        const activeChallengesCount = await db.get(`
            SELECT COUNT(*) as count
            FROM user_challenges uc
            JOIN challenges c ON uc.challenge_id = c.id
            WHERE uc.user_id = ? 
            AND uc.is_completed = 0
            AND datetime(uc.started_at, '+' || c.duration_days || ' days') > datetime('now')
        `, [userId]);
        
        // Calculate completion rate
        const completionRate = todayStats.total_habits > 0 
            ? Math.round((todayStats.completed_habits / todayStats.total_habits) * 100)
            : 0;
            
        const successRate = weeklyStats.total_logs > 0
            ? Math.round((weeklyStats.successful_logs / weeklyStats.total_logs) * 100)
            : 0;
        
        successResponse(res, {
            user: userStats,
            today: {
                ...todayStats,
                completion_rate: completionRate
            },
            week: {
                ...weeklyStats,
                success_rate: successRate
            },
            achievements_count: achievementsCount.count,
            active_challenges_count: activeChallengesCount.count
        });
        
    } catch (error) {
        console.error('Fetch dashboard stats error:', error);
        errorResponse(res, 500, 'Failed to fetch dashboard stats');
    }
}));

// Get habit analytics
router.get('/habits', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = '30' } = req.query; // days
        
        // Get habit performance over time
        const habitPerformance = await db.query(`
            SELECT h.id, h.name, h.color, h.category, h.type,
                   COUNT(hl.id) as total_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                   ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate,
                   SUM(hl.points_earned) as total_points,
                   MAX(hl.streak_day) as best_streak
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-' || ? || ' days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.id, h.name, h.color, h.category, h.type
            ORDER BY success_rate DESC, total_points DESC
        `, [period, userId]);
        
        // Get daily completion data for charts
        const dailyData = await db.query(`
            WITH date_series AS (
                SELECT date('now', '-' || (ROW_NUMBER() OVER () - 1) || ' days') as date
                FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
                      UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
                      UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
                      UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
                      UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25
                      UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30)
                WHERE ROW_NUMBER() OVER () <= ?
                ORDER BY date DESC
            )
            SELECT ds.date,
                   COALESCE(COUNT(hl.id), 0) as total_habits,
                   COALESCE(SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END), 0) as completed_habits,
                   COALESCE(SUM(hl.points_earned), 0) as points_earned
            FROM date_series ds
            LEFT JOIN habit_logs hl ON ds.date = hl.date
            LEFT JOIN habits h ON hl.habit_id = h.id AND h.user_id = ?
            GROUP BY ds.date
            ORDER BY ds.date ASC
        `, [period, userId]);
        
        // Get category breakdown
        const categoryStats = await db.query(`
            SELECT h.category,
                   COUNT(DISTINCT h.id) as habit_count,
                   COUNT(hl.id) as total_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                   SUM(hl.points_earned) as total_points
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-' || ? || ' days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.category
            ORDER BY total_points DESC
        `, [period, userId]);
        
        successResponse(res, {
            habits: habitPerformance,
            daily_data: dailyData,
            categories: categoryStats
        });
        
    } catch (error) {
        console.error('Fetch habit analytics error:', error);
        errorResponse(res, 500, 'Failed to fetch habit analytics');
    }
}));

// Get streak analytics
router.get('/streaks', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get overall streak stats
        const overallStats = await db.get(`
            SELECT current_streak, longest_streak
            FROM user_stats
            WHERE user_id = ?
        `, [userId]);
        
        // Get individual habit streaks
        const habitStreaks = await db.query(`
            SELECT h.id, h.name, h.color, h.icon,
                   MAX(hl.streak_day) as best_streak,
                   (SELECT hl2.streak_day 
                    FROM habit_logs hl2 
                    WHERE hl2.habit_id = h.id 
                    ORDER BY hl2.date DESC 
                    LIMIT 1) as current_streak
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.id, h.name, h.color, h.icon
            ORDER BY current_streak DESC
        `, [userId]);
        
        // Get streak history (last 90 days)
        const streakHistory = await db.query(`
            WITH daily_streaks AS (
                SELECT hl.date,
                       COUNT(CASE WHEN hl.success = 1 THEN 1 END) as successful_habits,
                       COUNT(*) as total_habits
                FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ? 
                AND hl.date >= date('now', '-90 days')
                GROUP BY hl.date
            )
            SELECT date,
                   successful_habits,
                   total_habits,
                   CASE WHEN total_habits > 0 AND successful_habits = total_habits THEN 1 ELSE 0 END as perfect_day
            FROM daily_streaks
            ORDER BY date ASC
        `, [userId]);
        
        successResponse(res, {
            overall: overallStats,
            habits: habitStreaks,
            history: streakHistory
        });
        
    } catch (error) {
        console.error('Fetch streak analytics error:', error);
        errorResponse(res, 500, 'Failed to fetch streak analytics');
    }
}));

// Get leaderboard
router.get('/leaderboard', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const { type = 'points', period = 'all' } = req.query;
        
        let orderBy = 'u.total_points DESC';
        let timeFilter = '';
        
        if (period === 'week') {
            timeFilter = `AND hl.date >= date('now', '-7 days')`;
        } else if (period === 'month') {
            timeFilter = `AND hl.date >= date('now', '-30 days')`;
        }
        
        switch (type) {
            case 'streak':
                orderBy = 'us.current_streak DESC, us.longest_streak DESC';
                break;
            case 'achievements':
                orderBy = 'achievement_count DESC';
                break;
            case 'habits':
                orderBy = 'habit_count DESC';
                break;
        }
        
        const leaderboard = await db.query(`
            SELECT u.id, u.username, u.total_points, u.level,
                   us.current_streak, us.longest_streak,
                   COUNT(DISTINCT ua.achievement_id) as achievement_count,
                   COUNT(DISTINCT h.id) as habit_count,
                   COALESCE(SUM(hl.points_earned), 0) as period_points
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            LEFT JOIN user_achievements ua ON u.id = ua.user_id
            LEFT JOIN habits h ON u.id = h.user_id AND h.is_active = 1
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id ${timeFilter}
            GROUP BY u.id, u.username, u.total_points, u.level, us.current_streak, us.longest_streak
            ORDER BY ${orderBy}
            LIMIT 50
        `);
        
        successResponse(res, leaderboard);
        
    } catch (error) {
        console.error('Fetch leaderboard error:', error);
        errorResponse(res, 500, 'Failed to fetch leaderboard');
    }
}));

module.exports = router;
