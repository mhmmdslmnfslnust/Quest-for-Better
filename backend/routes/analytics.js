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
        
        // Simple date generation for SQLite compatibility
        const performanceTrend = [];
        for (let i = parseInt(period) - 1; i >= 0; i--) {
            const dateData = await db.get(`
                SELECT 
                    date('now', '-' || ? || ' days') as date,
                    COUNT(hl.id) as total_habits,
                    SUM(CASE WHEN hl.success = 1 THEN 1 ELSE 0 END) as completed_habits,
                    SUM(hl.points_earned) as points_earned,
                    CASE WHEN COUNT(hl.id) > 0 
                         THEN ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1)
                         ELSE 0 END as success_rate
                FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ? AND hl.date = date('now', '-' || ? || ' days')
            `, [i, userId, i]);
            
            performanceTrend.push({
                date: dateData.date,
                total_habits: dateData.total_habits || 0,
                completed_habits: dateData.completed_habits || 0,
                points_earned: dateData.points_earned || 0,
                success_rate: dateData.success_rate || 0
            });
        }
        
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
        
        // Simple correlation analysis - find habits that are often completed on the same days
        const habitSynergies = await db.query(`
            SELECT 
                h1.name as habit1_name,
                h2.name as habit2_name,
                h1.category as habit1_category,
                h2.category as habit2_category,
                COUNT(*) as both_completed_days
            FROM habit_logs hl1
            JOIN habits h1 ON hl1.habit_id = h1.id
            JOIN habit_logs hl2 ON hl1.date = hl2.date AND hl1.habit_id != hl2.habit_id
            JOIN habits h2 ON hl2.habit_id = h2.id
            WHERE h1.user_id = ? AND h2.user_id = ?
            AND hl1.success = 1 AND hl2.success = 1
            AND hl1.date >= date('now', '-60 days')
            GROUP BY h1.id, h2.id
            HAVING COUNT(*) >= 5
            ORDER BY both_completed_days DESC
            LIMIT 10
        `, [userId, userId]);
        
        // Category synergies
        const categorySynergies = await db.query(`
            SELECT 
                h.category,
                COUNT(*) as active_days,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as avg_success_rate,
                MAX(CASE WHEN hl.success = 1 THEN 100 ELSE 0 END) as best_day_rate,
                MIN(CASE WHEN hl.success = 1 THEN 100 ELSE 0 END) as worst_day_rate
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ?
            AND hl.date >= date('now', '-60 days')
            GROUP BY h.category
            ORDER BY avg_success_rate DESC
        `, [userId]);
        
        successResponse(res, {
            habit_synergies: habitSynergies.map(s => ({
                ...s,
                correlation_strength: Math.min(95, s.both_completed_days * 10) // Simple strength calculation
            })),
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
        
        // Get next achievements (simplified)
        const nextAchievements = await db.query(`
            SELECT a.id, a.name, a.description, a.condition_type, a.condition_value, 
                   a.points_reward, a.badge_emoji, a.rarity
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE ua.id IS NULL
            AND a.condition_type IN ('streak', 'total_points', 'habits_completed')
            ORDER BY a.condition_value ASC
            LIMIT 5
        `, [userId]);
        
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
        
        // Simple ranking calculation
        const userRankings = await db.get(`
            SELECT 
                u.id,
                u.total_points,
                COALESCE(us.current_streak, 0) as current_streak,
                COALESCE(us.longest_streak, 0) as longest_streak,
                (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as achievement_count,
                (SELECT COUNT(*) + 1 FROM users u2 WHERE u2.total_points > u.total_points) as points_rank,
                (SELECT COUNT(*) FROM users) as total_count
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `, [userId]);
        
        // Calculate percentiles
        if (userRankings) {
            userRankings.points_percentile = Math.round((userRankings.total_count - userRankings.points_rank + 1) * 100.0 / userRankings.total_count);
            userRankings.streak_percentile = 75; // Simplified for now
            userRankings.achievement_percentile = 80; // Simplified for now
        }
        
        // Get community averages for comparison
        const communityAverages = await db.get(`
            SELECT 
                ROUND(AVG(u.total_points), 0) as avg_points,
                ROUND(AVG(COALESCE(us.current_streak, 0)), 1) as avg_current_streak,
                ROUND(AVG(COALESCE(us.longest_streak, 0)), 1) as avg_longest_streak,
                2.5 as avg_achievements
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
        `);
        
        // Get category comparison with community (simplified)
        const categoryComparison = await db.query(`
            SELECT 
                h.category,
                COUNT(DISTINCT h.id) as user_habit_count,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) as user_success_rate,
                70 as community_avg_success_rate,
                ROUND(AVG(CASE WHEN hl.success = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) - 70 as difference_from_average
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id 
                AND hl.date >= date('now', '-30 days')
            WHERE h.user_id = ? AND h.is_active = 1
            GROUP BY h.category
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
