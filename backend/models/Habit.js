const db = require('./database');

class Habit {
    // Create a new habit
    static async create(habitData) {
        const sql = `
            INSERT INTO habits (user_id, name, description, category, type, difficulty, 
                              target_frequency, points_per_success, color, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const pointsPerSuccess = this.calculatePointsPerSuccess(habitData.difficulty);
        
        return await db.run(sql, [
            habitData.user_id,
            habitData.name,
            habitData.description || '',
            habitData.category,
            habitData.type,
            habitData.difficulty,
            habitData.target_frequency || 1,
            pointsPerSuccess,
            habitData.color || '#6366f1',
            habitData.icon || '🎯'
        ]);
    }

    // Calculate points based on difficulty
    static calculatePointsPerSuccess(difficulty) {
        const basePoints = {
            1: 10, // Very Easy
            2: 15, // Easy
            3: 25, // Medium
            4: 40, // Hard
            5: 60  // Very Hard
        };
        return basePoints[difficulty] || 25;
    }

    // Get all habits for a user
    static async findByUserId(userId) {
        const sql = `
            SELECT h.*,
                   (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id = h.id AND hl.success = 1) as completed_count,
                   (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id = h.id) as total_logs,
                   (SELECT MAX(hl.streak_day) FROM habit_logs hl WHERE hl.habit_id = h.id) as best_streak,
                   (SELECT hl.date FROM habit_logs hl WHERE hl.habit_id = h.id ORDER BY hl.date DESC LIMIT 1) as last_logged
            FROM habits h
            WHERE h.user_id = ? AND h.is_active = 1
            ORDER BY h.created_at DESC
        `;
        
        return await db.query(sql, [userId]);
    }

    // Get habit by ID
    static async findById(habitId) {
        const sql = `
            SELECT h.*,
                   u.username,
                   (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id = h.id AND hl.success = 1) as completed_count,
                   (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id = h.id) as total_logs,
                   (SELECT MAX(hl.streak_day) FROM habit_logs hl WHERE hl.habit_id = h.id) as best_streak
            FROM habits h
            JOIN users u ON h.user_id = u.id
            WHERE h.id = ?
        `;
        
        return await db.get(sql, [habitId]);
    }

    // Update habit
    static async update(habitId, habitData) {
        const sql = `
            UPDATE habits 
            SET name = ?, description = ?, category = ?, difficulty = ?,
                target_frequency = ?, color = ?, icon = ?
            WHERE id = ?
        `;
        
        return await db.run(sql, [
            habitData.name,
            habitData.description,
            habitData.category,
            habitData.difficulty,
            habitData.target_frequency,
            habitData.color,
            habitData.icon,
            habitId
        ]);
    }

    // Delete habit (soft delete)
    static async delete(habitId) {
        const sql = `UPDATE habits SET is_active = 0 WHERE id = ?`;
        return await db.run(sql, [habitId]);
    }

    // Log habit completion
    static async logCompletion(habitId, date, success, notes = '') {
        // Check if log already exists for this date
        const existingLog = await db.get(`
            SELECT id FROM habit_logs 
            WHERE habit_id = ? AND date = ?
        `, [habitId, date]);

        if (existingLog) {
            // Update existing log
            const sql = `
                UPDATE habit_logs 
                SET success = ?, notes = ?, logged_at = CURRENT_TIMESTAMP
                WHERE habit_id = ? AND date = ?
            `;
            return await db.run(sql, [success, notes, habitId, date]);
        } else {
            // Create new log
            const habit = await this.findById(habitId);
            if (!habit) throw new Error('Habit not found');

            // Calculate streak
            const streak = await this.calculateStreak(habitId, date, success);
            const pointsEarned = success ? habit.points_per_success * (1 + Math.floor(streak / 7) * 0.1) : 0;

            const sql = `
                INSERT INTO habit_logs (habit_id, date, success, notes, points_earned, streak_day)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const result = await db.run(sql, [habitId, date, success, notes, Math.round(pointsEarned), streak]);
            
            // Update user points if successful
            if (success && pointsEarned > 0) {
                const User = require('./User');
                await User.updatePointsAndLevel(habit.user_id, Math.round(pointsEarned));
            }
            
            return result;
        }
    }

    // Calculate current streak for a habit
    static async calculateStreak(habitId, currentDate, currentSuccess) {
        const logs = await db.query(`
            SELECT date, success
            FROM habit_logs
            WHERE habit_id = ? AND date <= ?
            ORDER BY date DESC
        `, [habitId, currentDate]);

        let streak = 0;
        
        // Include current log if successful
        if (currentSuccess) {
            streak = 1;
        }

        // Count consecutive successful days
        for (let i = 0; i < logs.length; i++) {
            if (logs[i].success === 1) {
                if (logs[i].date < currentDate) {
                    streak++;
                }
            } else {
                break;
            }
        }

        return streak;
    }

    // Get habit logs for a specific period
    static async getLogsForPeriod(habitId, startDate, endDate) {
        const sql = `
            SELECT * FROM habit_logs
            WHERE habit_id = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `;
        
        return await db.query(sql, [habitId, startDate, endDate]);
    }

    // Get habit statistics
    static async getStatistics(habitId) {
        const sql = `
            SELECT 
                COUNT(*) as total_logs,
                SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_logs,
                SUM(points_earned) as total_points_earned,
                MAX(streak_day) as best_streak,
                AVG(CASE WHEN success = 1 THEN 1.0 ELSE 0.0 END) * 100 as success_rate
            FROM habit_logs
            WHERE habit_id = ?
        `;
        
        return await db.get(sql, [habitId]);
    }

    // Get habits by category
    static async findByCategory(userId, category) {
        const sql = `
            SELECT * FROM habits
            WHERE user_id = ? AND category = ? AND is_active = 1
            ORDER BY created_at DESC
        `;
        
        return await db.query(sql, [userId, category]);
    }

    // Get today's habit status for user
    static async getTodayStatus(userId, date) {
        const sql = `
            SELECT h.id, h.name, h.color, h.icon, h.type,
                   hl.success as logged_today,
                   hl.notes as today_notes
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.date = ?
            WHERE h.user_id = ? AND h.is_active = 1
            ORDER BY h.created_at ASC
        `;
        
        return await db.query(sql, [date, userId]);
    }
}

module.exports = Habit;
