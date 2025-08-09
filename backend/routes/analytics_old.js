const express = require('express');
const db = require('../models/database');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get comprehensive analytics overview
router.get('/overview', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = '30' } = req.query;
        
        // Get user basic stats
        const userStats = await db.get(`
            SELECT u.total_points, u.level, u.created_at, us.*
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `, [userId]);
        
        // Get habit performance trends (last 30 days)
        const performanceTrend = await db.query(`
            WITH RECURSIVE date_series(date, n) AS (
                SELECT date('now', '-' || ? || ' days'), 0
                UNION ALL
                SELECT date('now', '-' || (? - n - 1) || ' days'), n + 1
                FROM date_series
                WHERE n < ?
            )
            SELECT ds.date,
                   COALESCE(COUNT(hl.id), 0) as total_habits,
                   COALESCE(SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END), 0) as completed_habits,
                   COALESCE(SUM(hl.points_earned), 0) as points_earned,
                   CASE WHEN COUNT(hl.id) > 0 
                        THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                        ELSE 0 END as success_rate
            FROM date_series ds
            LEFT JOIN habit_logs hl ON ds.date = hl.date
            LEFT JOIN habits h ON hl.habit_id = h.id AND h.user_id = ?
            GROUP BY ds.date
            ORDER BY ds.date ASC
        `, [period, period, period, userId]);
        
        // Get category performance
        const categoryPerformance = await db.query(`
            SELECT h.category,
                   COUNT(DISTINCT h.id) as habit_count,
                   COUNT(hl.id) as total_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                   CASE WHEN COUNT(hl.id) > 0 
                        THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                        ELSE 0 END as success_rate,
                   SUM(hl.points_earned) as total_points,
                   MAX(hl.streak_day) as best_streak
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-' || ? || ' days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.category
            ORDER BY success_rate DESC, total_points DESC
        `, [period, userId]);
        
        // Get top performing habits
        const topHabits = await db.query(`
            SELECT h.id, h.name, h.color, h.icon, h.category,
                   COUNT(hl.id) as total_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                   CASE WHEN COUNT(hl.id) > 0 
                        THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                        ELSE 0 END as success_rate,
                   SUM(hl.points_earned) as total_points,
                   MAX(hl.streak_day) as best_streak
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-' || ? || ' days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.id, h.name, h.color, h.icon, h.category
            HAVING COUNT(hl.id) > 0
            ORDER BY success_rate DESC, total_points DESC
            LIMIT 5
        `, [period, userId]);
        
        // Calculate wellness score (composite metric)
        const totalDays = performanceTrend.length;
        const activeDays = performanceTrend.filter(day => day.total_habits > 0).length;
        const avgSuccessRate = performanceTrend.length > 0 
            ? performanceTrend.reduce((sum, day) => sum + day.success_rate, 0) / totalDays
            : 0;
        const consistencyScore = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;
        const wellnessScore = Math.round((avgSuccessRate * 0.6) + (consistencyScore * 0.4));
        
        successResponse(res, {
            user_stats: userStats,
            performance_trend: performanceTrend,
            category_performance: categoryPerformance,
            top_habits: topHabits,
            wellness_score: wellnessScore,
            insights: {
                avg_success_rate: Math.round(avgSuccessRate),
                consistency_score: Math.round(consistencyScore),
                active_days: activeDays,
                total_days: totalDays
            }
        });
        
    } catch (error) {
        console.error('Analytics overview error:', error);
        errorResponse(res, 500, 'Failed to fetch analytics overview');
    }
}));

// Get daily/weekly pattern analysis
router.get('/patterns', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Daily pattern analysis (which days of week are most successful)
        const dailyPatterns = await db.query(`
            SELECT 
                CASE strftime('%w', hl.date)
                    WHEN '0' THEN 'Sunday'
                    WHEN '1' THEN 'Monday' 
                    WHEN '2' THEN 'Tuesday'
                    WHEN '3' THEN 'Wednesday'
                    WHEN '4' THEN 'Thursday'
                    WHEN '5' THEN 'Friday'
                    WHEN '6' THEN 'Saturday'
                END as day_of_week,
                strftime('%w', hl.date) as day_number,
                COUNT(*) as total_logs,
                SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ?
            AND hl.date >= date('now', '-90 days')
            GROUP BY strftime('%w', hl.date)
            ORDER BY day_number
        `, [userId]);
        
        // Hourly pattern analysis (what time of day is most successful)
        const hourlyPatterns = await db.query(`
            SELECT 
                strftime('%H', hl.logged_at) as hour,
                COUNT(*) as total_logs,
                SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ?
            AND hl.date >= date('now', '-90 days')
            GROUP BY strftime('%H', hl.logged_at)
            HAVING COUNT(*) >= 3
            ORDER BY hour
        `, [userId]);
        
        // Monthly progression
        const monthlyProgression = await db.query(`
            SELECT 
                strftime('%Y-%m', hl.date) as month,
                COUNT(*) as total_logs,
                SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate,
                SUM(hl.points_earned) as points_earned
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ?
            AND hl.date >= date('now', '-12 months')
            GROUP BY strftime('%Y-%m', hl.date)
            ORDER BY month
        `, [userId]);
        
        successResponse(res, {
            daily_patterns: dailyPatterns,
            hourly_patterns: hourlyPatterns,
            monthly_progression: monthlyProgression
        });
        
    } catch (error) {
        console.error('Pattern analysis error:', error);
        errorResponse(res, 500, 'Failed to fetch pattern analysis');
    }
}));

// Get habit correlations and synergies
router.get('/correlations', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find habits that tend to be completed together
        const habitSynergies = await db.query(`
            WITH daily_completions AS (
                SELECT 
                    hl.date,
                    h.id as habit_id,
                    h.name as habit_name,
                    h.category,
                    CASE WHEN hl.success = 1 THEN 1 ELSE 0 END as completed
                FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ?
                AND hl.date >= date('now', '-60 days')
            ),
            habit_pairs AS (
                SELECT 
                    dc1.habit_id as habit1_id,
                    dc1.habit_name as habit1_name,
                    dc1.category as habit1_category,
                    dc2.habit_id as habit2_id,
                    dc2.habit_name as habit2_name,
                    dc2.category as habit2_category,
                    COUNT(*) as total_days,
                    SUM(dc1.completed * dc2.completed) as both_completed,
                    SUM(dc1.completed) as habit1_completed,
                    SUM(dc2.completed) as habit2_completed
                FROM daily_completions dc1
                JOIN daily_completions dc2 ON dc1.date = dc2.date AND dc1.habit_id < dc2.habit_id
                GROUP BY dc1.habit_id, dc2.habit_id
                HAVING total_days >= 10
            )
            SELECT *,
                CASE WHEN habit1_completed > 0 AND habit2_completed > 0 
                     THEN ROUND((both_completed * 1.0 / LEAST(habit1_completed, habit2_completed)) * 100, 1)
                     ELSE 0 END as correlation_strength
            FROM habit_pairs
            WHERE correlation_strength >= 50
            ORDER BY correlation_strength DESC
            LIMIT 10
        `, [userId]);
        
        // Category synergies
        const categorySynergies = await db.query(`
            WITH daily_category_performance AS (
                SELECT 
                    hl.date,
                    h.category,
                    COUNT(*) as total_habits,
                    SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as completed_habits,
                    CASE WHEN COUNT(*) > 0 
                         THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                         ELSE 0 END as daily_success_rate
                FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ?
                AND hl.date >= date('now', '-60 days')
                GROUP BY hl.date, h.category
            )
            SELECT 
                category,
                COUNT(*) as active_days,
                AVG(daily_success_rate) as avg_success_rate,
                MAX(daily_success_rate) as best_day_rate,
                MIN(daily_success_rate) as worst_day_rate
            FROM daily_category_performance
            GROUP BY category
            ORDER BY avg_success_rate DESC
        `, [userId]);
        
        successResponse(res, {
            habit_synergies: habitSynergies,
            category_synergies: categorySynergies
        });
        
    } catch (error) {
        console.error('Correlation analysis error:', error);
        errorResponse(res, 500, 'Failed to fetch correlation analysis');
    }
}));

// Get intelligent predictions and recommendations
router.get('/predictions', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Analyze recent performance to predict success probability
        const recentPerformance = await db.get(`
            SELECT 
                COUNT(*) as total_logs,
                SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as successful_logs,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ?
            AND hl.date >= date('now', '-7 days')
        `, [userId]);
        
        // Find struggling habits that need attention
        const strugglingHabits = await db.query(`
            SELECT h.id, h.name, h.category, h.color, h.icon,
                   COUNT(hl.id) as recent_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as recent_successes,
                   CASE WHEN COUNT(hl.id) > 0 
                        THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                        ELSE 0 END as recent_success_rate
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-14 days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.id, h.name, h.category, h.color, h.icon
            HAVING recent_logs > 0 AND recent_success_rate < 60
            ORDER BY recent_success_rate ASC
            LIMIT 3
        `, [userId]);
        
        // Find star performer habits
        const starHabits = await db.query(`
            SELECT h.id, h.name, h.category, h.color, h.icon,
                   COUNT(hl.id) as recent_logs,
                   SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as recent_successes,
                   CASE WHEN COUNT(hl.id) > 0 
                        THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                        ELSE 0 END as recent_success_rate
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-14 days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.id, h.name, h.category, h.color, h.icon
            HAVING recent_logs >= 5 AND recent_success_rate >= 80
            ORDER BY recent_success_rate DESC
            LIMIT 3
        `, [userId]);
        
        // Generate personalized recommendations
        const recommendations = [];
        
        if (strugglingHabits.length > 0) {
            recommendations.push({
                type: 'improvement',
                title: 'Focus on Struggling Habits',
                description: `Your ${strugglingHabits[0].name} habit needs attention. Try reducing difficulty or changing the time you do it.`,
                action: 'Review habit settings',
                priority: 'high'
            });
        }
        
        if (starHabits.length > 0) {
            recommendations.push({
                type: 'expansion',
                title: 'Build on Success',
                description: `Great job with ${starHabits[0].name}! Consider adding a related habit in the ${starHabits[0].category} category.`,
                action: 'Add related habit',
                priority: 'medium'
            });
        }
        
        if (recentPerformance.success_rate > 75) {
            recommendations.push({
                type: 'challenge',
                title: 'Ready for a Challenge',
                description: 'Your recent performance is excellent! Time to join a community challenge.',
                action: 'Browse challenges',
                priority: 'low'
            });
        }
        
        successResponse(res, {
            recent_performance: recentPerformance,
            struggling_habits: strugglingHabits,
            star_habits: starHabits,
            recommendations: recommendations,
            success_probability: Math.min(95, Math.max(10, recentPerformance.success_rate + 10))
        });
        
    } catch (error) {
        console.error('Predictions error:', error);
        errorResponse(res, 500, 'Failed to fetch predictions');
    }
}));

// Get achievement analytics
router.get('/achievements', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get achievement progress overview
        const achievementStats = await db.get(`
            SELECT 
                COUNT(DISTINCT a.id) as total_achievements,
                COUNT(DISTINCT ua.achievement_id) as earned_achievements,
                ROUND(COUNT(DISTINCT ua.achievement_id) * 100.0 / COUNT(DISTINCT a.id), 1) as completion_percentage
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
        `, [userId]);
        
        // Get rarity breakdown
        const rarityBreakdown = await db.query(`
            SELECT 
                a.rarity,
                COUNT(DISTINCT a.id) as total_count,
                COUNT(DISTINCT ua.achievement_id) as earned_count,
                CASE WHEN COUNT(DISTINCT a.id) > 0 
                     THEN ROUND(COUNT(DISTINCT ua.achievement_id) * 100.0 / COUNT(DISTINCT a.id), 1)
                     ELSE 0 END as completion_rate
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            GROUP BY a.rarity
            ORDER BY 
                CASE a.rarity 
                    WHEN 'common' THEN 1 
                    WHEN 'rare' THEN 2 
                    WHEN 'epic' THEN 3 
                    WHEN 'legendary' THEN 4 
                END
        `, [userId]);
        
        // Get category breakdown
        const categoryBreakdown = await db.query(`
            SELECT 
                a.category,
                COUNT(DISTINCT a.id) as total_count,
                COUNT(DISTINCT ua.achievement_id) as earned_count,
                CASE WHEN COUNT(DISTINCT a.id) > 0 
                     THEN ROUND(COUNT(DISTINCT ua.achievement_id) * 100.0 / COUNT(DISTINCT a.id), 1)
                     ELSE 0 END as completion_rate
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            GROUP BY a.category
            ORDER BY completion_rate DESC
        `, [userId]);
        
        // Get recent achievements
        const recentAchievements = await db.query(`
            SELECT a.name, a.description, a.badge_emoji, a.rarity, ua.earned_at
            FROM achievements a
            JOIN user_achievements ua ON a.id = ua.achievement_id
            WHERE ua.user_id = ?
            ORDER BY ua.earned_at DESC
            LIMIT 5
        `, [userId]);
        
        // Get next achievements (closest to completion)
        const nextAchievements = await db.query(`
            SELECT a.id, a.name, a.description, a.condition_type, a.condition_value, 
                   a.points_reward, a.badge_emoji, a.rarity,
                   CASE 
                       WHEN a.condition_type = 'streak' THEN 
                           (SELECT COALESCE(current_streak, 0) FROM user_stats WHERE user_id = ?)
                       WHEN a.condition_type = 'total_points' THEN 
                           (SELECT COALESCE(total_points, 0) FROM users WHERE id = ?)
                       WHEN a.condition_type = 'habits_completed' THEN 
                           (SELECT COALESCE(total_habits_completed, 0) FROM user_stats WHERE user_id = ?)
                       ELSE 0
                   END as current_progress,
                   CASE 
                       WHEN a.condition_type = 'streak' THEN 
                           ROUND((SELECT COALESCE(current_streak, 0) FROM user_stats WHERE user_id = ?) * 100.0 / a.condition_value, 1)
                       WHEN a.condition_type = 'total_points' THEN 
                           ROUND((SELECT COALESCE(total_points, 0) FROM users WHERE id = ?) * 100.0 / a.condition_value, 1)
                       WHEN a.condition_type = 'habits_completed' THEN 
                           ROUND((SELECT COALESCE(total_habits_completed, 0) FROM user_stats WHERE user_id = ?) * 100.0 / a.condition_value, 1)
                       ELSE 0
                   END as progress_percentage
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE ua.id IS NULL
            AND a.condition_type IN ('streak', 'total_points', 'habits_completed')
            ORDER BY progress_percentage DESC
            LIMIT 5
        `, [userId, userId, userId, userId, userId, userId, userId]);
        
        successResponse(res, {
            overview: achievementStats,
            rarity_breakdown: rarityBreakdown,
            category_breakdown: categoryBreakdown,
            recent_achievements: recentAchievements,
            next_achievements: nextAchievements
        });
        
    } catch (error) {
        console.error('Achievement analytics error:', error);
        errorResponse(res, 500, 'Failed to fetch achievement analytics');
    }
}));

// Get community comparison insights
router.get('/community', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's rank in various metrics
        const userRankings = await db.get(`
            WITH user_rankings AS (
                SELECT 
                    u.id,
                    u.total_points,
                    COALESCE(us.current_streak, 0) as current_streak,
                    COALESCE(us.longest_streak, 0) as longest_streak,
                    COUNT(DISTINCT ua.achievement_id) as achievement_count,
                    ROW_NUMBER() OVER (ORDER BY u.total_points DESC) as points_rank,
                    ROW_NUMBER() OVER (ORDER BY us.current_streak DESC) as streak_rank,
                    ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT ua.achievement_id) DESC) as achievement_rank
                FROM users u
                LEFT JOIN user_stats us ON u.id = us.user_id
                LEFT JOIN user_achievements ua ON u.id = ua.user_id
                GROUP BY u.id, u.total_points, us.current_streak, us.longest_streak
            ),
            total_users AS (
                SELECT COUNT(*) as total_count FROM users
            )
            SELECT ur.*, tu.total_count,
                ROUND((tu.total_count - ur.points_rank + 1) * 100.0 / tu.total_count, 1) as points_percentile,
                ROUND((tu.total_count - ur.streak_rank + 1) * 100.0 / tu.total_count, 1) as streak_percentile,
                ROUND((tu.total_count - ur.achievement_rank + 1) * 100.0 / tu.total_count, 1) as achievement_percentile
            FROM user_rankings ur, total_users tu
            WHERE ur.id = ?
        `, [userId]);
        
        // Get community averages for comparison
        const communityAverages = await db.get(`
            SELECT 
                ROUND(AVG(u.total_points), 0) as avg_points,
                ROUND(AVG(COALESCE(us.current_streak, 0)), 1) as avg_current_streak,
                ROUND(AVG(COALESCE(us.longest_streak, 0)), 1) as avg_longest_streak,
                ROUND(AVG(achievement_counts.count), 1) as avg_achievements
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            LEFT JOIN (
                SELECT user_id, COUNT(*) as count 
                FROM user_achievements 
                GROUP BY user_id
            ) achievement_counts ON u.id = achievement_counts.user_id
        `);
        
        // Get category comparison with community
        const categoryComparison = await db.query(`
            WITH user_category_stats AS (
                SELECT 
                    h.category,
                    COUNT(DISTINCT h.id) as user_habit_count,
                    ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as user_success_rate
                FROM habits h
                LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                    AND hl.date >= date('now', '-30 days')
                WHERE h.user_id = ? AND h.is_active = 1
                GROUP BY h.category
            ),
            community_category_stats AS (
                SELECT 
                    h.category,
                    ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as community_avg_success_rate
                FROM habits h
                LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                    AND hl.date >= date('now', '-30 days')
                WHERE h.is_active = 1
                GROUP BY h.category
            )
            SELECT 
                ucs.category,
                ucs.user_habit_count,
                ucs.user_success_rate,
                COALESCE(ccs.community_avg_success_rate, 0) as community_avg_success_rate,
                CASE WHEN ccs.community_avg_success_rate > 0 
                     THEN ROUND(ucs.user_success_rate - ccs.community_avg_success_rate, 1)
                     ELSE 0 END as difference_from_average
            FROM user_category_stats ucs
            LEFT JOIN community_category_stats ccs ON ucs.category = ccs.category
            ORDER BY difference_from_average DESC
        `, [userId]);
        
        successResponse(res, {
            user_rankings: userRankings,
            community_averages: communityAverages,
            category_comparison: categoryComparison
        });
        
    } catch (error) {
        console.error('Community analytics error:', error);
        errorResponse(res, 500, 'Failed to fetch community analytics');
    }
}));

module.exports = router;
