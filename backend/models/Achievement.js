const db = require('./database');

class Achievement {
    // Check and award achievements for a user
    static async checkAndAwardAchievements(userId) {
        try {
            const newAchievements = [];
            
            // Get user's current stats
            const userStats = await this.getUserStats(userId);
            const allAchievements = await this.getAllAchievements();
            const userAchievements = await this.getUserAchievements(userId);
            
            // Get IDs of already earned achievements
            const earnedIds = userAchievements.map(ua => ua.achievement_id);
            
            // Check each achievement
            for (const achievement of allAchievements) {
                if (earnedIds.includes(achievement.id)) continue; // Already earned
                
                if (await this.checkAchievementCondition(userId, achievement, userStats)) {
                    await this.awardAchievement(userId, achievement.id);
                    newAchievements.push(achievement);
                }
            }
            
            return newAchievements;
        } catch (error) {
            console.error('Error checking achievements:', error);
            throw error;
        }
    }
    
    // Check if user meets achievement condition
    static async checkAchievementCondition(userId, achievement, userStats) {
        try {
            switch (achievement.condition_type) {
                case 'streak':
                    return userStats.current_streak >= achievement.condition_value;
                    
                case 'total_points':
                    return userStats.total_points >= achievement.condition_value;
                    
                case 'habits_completed':
                    return userStats.total_habits_completed >= achievement.condition_value;
                    
                case 'habits_created':
                    const habitCount = await this.getUserHabitCount(userId);
                    return habitCount >= achievement.condition_value;
                    
                case 'category_variety':
                    const categoryCount = await this.getUserCategoryCount(userId);
                    return categoryCount >= achievement.condition_value;
                    
                case 'early_bird':
                    return await this.checkEarlyBirdCompletion(userId);
                    
                case 'night_owl':
                    return await this.checkNightOwlCompletion(userId);
                    
                case 'perfect_week':
                    return await this.checkPerfectWeek(userId);
                    
                case 'comeback':
                    return await this.checkComebackKid(userId);
                    
                default:
                    return false;
            }
        } catch (error) {
            console.error('Error checking achievement condition:', error);
            return false;
        }
    }
    
    // Get user statistics for achievement checking
    static async getUserStats(userId) {
        try {
            // Get user's basic info
            const user = await db.query('SELECT total_points FROM users WHERE id = ?', [userId]);
            
            // Get or create user stats
            let stats = await db.query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
            
            if (stats.length === 0) {
                // Create initial stats if they don't exist
                await db.query(`
                    INSERT INTO user_stats (
                        user_id, current_streak, longest_streak, 
                        total_habits_completed, habits_broken, habits_built
                    ) VALUES (?, 0, 0, 0, 0, 0)
                `, [userId]);
                
                stats = await db.query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
            }
            
            // Calculate current streak from habit logs
            const currentStreak = await this.calculateCurrentStreak(userId);
            
            // Update current streak in stats
            await db.query(
                'UPDATE user_stats SET current_streak = ? WHERE user_id = ?',
                [currentStreak, userId]
            );
            
            return {
                ...stats[0],
                current_streak: currentStreak,
                total_points: user[0]?.total_points || 0
            };
        } catch (error) {
            console.error('Error getting user stats:', error);
            throw error;
        }
    }
    
    // Calculate user's current streak
    static async calculateCurrentStreak(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            let streak = 0;
            let checkDate = new Date(today);
            
            while (true) {
                const dateStr = checkDate.toISOString().split('T')[0];
                
                // Check if user completed any habits on this date
                const completions = await db.query(`
                    SELECT COUNT(*) as count FROM habit_logs hl
                    JOIN habits h ON hl.habit_id = h.id
                    WHERE h.user_id = ? AND hl.date = ? AND hl.success = 1
                `, [userId, dateStr]);
                
                if (completions[0].count > 0) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            
            return streak;
        } catch (error) {
            console.error('Error calculating current streak:', error);
            return 0;
        }
    }
    
    // Get all available achievements
    static async getAllAchievements() {
        try {
            return await db.query('SELECT * FROM achievements ORDER BY category, points_reward ASC');
        } catch (error) {
            console.error('Error getting all achievements:', error);
            throw error;
        }
    }
    
    // Get user's earned achievements
    static async getUserAchievements(userId) {
        try {
            return await db.query(`
                SELECT a.*, ua.earned_at
                FROM achievements a
                JOIN user_achievements ua ON a.id = ua.achievement_id
                WHERE ua.user_id = ?
                ORDER BY ua.earned_at DESC
            `, [userId]);
        } catch (error) {
            console.error('Error getting user achievements:', error);
            throw error;
        }
    }
    
    // Award achievement to user
    static async awardAchievement(userId, achievementId) {
        try {
            // Insert user achievement
            await db.query(`
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (?, ?)
            `, [userId, achievementId]);
            
            // Get achievement points and add to user
            const achievement = await db.query('SELECT points_reward FROM achievements WHERE id = ?', [achievementId]);
            if (achievement.length > 0) {
                await db.query(
                    'UPDATE users SET total_points = total_points + ? WHERE id = ?',
                    [achievement[0].points_reward, userId]
                );
            }
            
            return true;
        } catch (error) {
            console.error('Error awarding achievement:', error);
            throw error;
        }
    }
    
    // Get user's habit count
    static async getUserHabitCount(userId) {
        try {
            const result = await db.query(
                'SELECT COUNT(*) as count FROM habits WHERE user_id = ? AND is_active = 1',
                [userId]
            );
            return result[0].count;
        } catch (error) {
            console.error('Error getting user habit count:', error);
            return 0;
        }
    }
    
    // Get user's category variety count
    static async getUserCategoryCount(userId) {
        try {
            const result = await db.query(
                'SELECT COUNT(DISTINCT category) as count FROM habits WHERE user_id = ? AND is_active = 1',
                [userId]
            );
            return result[0].count;
        } catch (error) {
            console.error('Error getting user category count:', error);
            return 0;
        }
    }
    
    // Check early bird achievement (completion before 7 AM)
    static async checkEarlyBirdCompletion(userId) {
        try {
            const result = await db.query(`
                SELECT COUNT(*) as count FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ? AND hl.success = 1 
                AND TIME(hl.logged_at) < '07:00:00'
                AND DATE(hl.logged_at) >= DATE('now', '-7 days')
            `, [userId]);
            
            return result[0].count > 0;
        } catch (error) {
            console.error('Error checking early bird:', error);
            return false;
        }
    }
    
    // Check night owl achievement (completion after 10 PM)
    static async checkNightOwlCompletion(userId) {
        try {
            const result = await db.query(`
                SELECT COUNT(*) as count FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = ? AND hl.success = 1 
                AND TIME(hl.logged_at) > '22:00:00'
                AND DATE(hl.logged_at) >= DATE('now', '-7 days')
            `, [userId]);
            
            return result[0].count > 0;
        } catch (error) {
            console.error('Error checking night owl:', error);
            return false;
        }
    }
    
    // Check perfect week achievement
    static async checkPerfectWeek(userId) {
        try {
            // Check if user completed all their habits for 7 consecutive days
            const userHabits = await db.query(
                'SELECT id FROM habits WHERE user_id = ? AND is_active = 1',
                [userId]
            );
            
            if (userHabits.length === 0) return false;
            
            let consecutiveDays = 0;
            const today = new Date();
            
            for (let i = 0; i < 14; i++) { // Check last 14 days
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() - i);
                const dateStr = checkDate.toISOString().split('T')[0];
                
                // Check if all habits were completed on this date
                const completedHabits = await db.query(`
                    SELECT COUNT(DISTINCT hl.habit_id) as count
                    FROM habit_logs hl
                    WHERE hl.habit_id IN (${userHabits.map(() => '?').join(',')})
                    AND hl.date = ? AND hl.success = 1
                `, [...userHabits.map(h => h.id), dateStr]);
                
                if (completedHabits[0].count === userHabits.length) {
                    consecutiveDays++;
                    if (consecutiveDays >= 7) return true;
                } else {
                    consecutiveDays = 0;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error checking perfect week:', error);
            return false;
        }
    }
    
    // Check comeback kid achievement
    static async checkComebackKid(userId) {
        try {
            // Check if user restarted a habit after 7+ day break
            const result = await db.query(`
                SELECT h.id, MAX(hl1.date) as last_success, MIN(hl2.date) as next_success
                FROM habits h
                LEFT JOIN habit_logs hl1 ON h.id = hl1.habit_id AND hl1.success = 1
                LEFT JOIN habit_logs hl2 ON h.id = hl2.habit_id AND hl2.success = 1 AND hl2.date > hl1.date
                WHERE h.user_id = ?
                GROUP BY h.id
                HAVING julianday(next_success) - julianday(last_success) >= 7
                AND DATE(next_success) >= DATE('now', '-30 days')
            `, [userId]);
            
            return result.length > 0;
        } catch (error) {
            console.error('Error checking comeback kid:', error);
            return false;
        }
    }
    
    // Get achievement progress for user
    static async getAchievementProgress(userId) {
        try {
            const userStats = await this.getUserStats(userId);
            const allAchievements = await this.getAllAchievements();
            const userAchievements = await this.getUserAchievements(userId);
            
            const earnedIds = userAchievements.map(ua => ua.achievement_id);
            
            const progress = [];
            
            for (const achievement of allAchievements) {
                const isEarned = earnedIds.includes(achievement.id);
                let currentProgress = 0;
                
                if (!isEarned) {
                    switch (achievement.condition_type) {
                        case 'streak':
                            currentProgress = Math.min(userStats.current_streak, achievement.condition_value);
                            break;
                        case 'total_points':
                            currentProgress = Math.min(userStats.total_points, achievement.condition_value);
                            break;
                        case 'habits_completed':
                            currentProgress = Math.min(userStats.total_habits_completed, achievement.condition_value);
                            break;
                        case 'habits_created':
                            const habitCount = await this.getUserHabitCount(userId);
                            currentProgress = Math.min(habitCount, achievement.condition_value);
                            break;
                        case 'category_variety':
                            const categoryCount = await this.getUserCategoryCount(userId);
                            currentProgress = Math.min(categoryCount, achievement.condition_value);
                            break;
                        default:
                            currentProgress = 0;
                    }
                }
                
                progress.push({
                    ...achievement,
                    is_earned: isEarned,
                    earned_at: isEarned ? userAchievements.find(ua => ua.achievement_id === achievement.id).earned_at : null,
                    progress: {
                        current: isEarned ? achievement.condition_value : currentProgress,
                        target: achievement.condition_value
                    }
                });
            }
            
            return progress;
        } catch (error) {
            console.error('Error getting achievement progress:', error);
            throw error;
        }
    }
}

module.exports = Achievement;
