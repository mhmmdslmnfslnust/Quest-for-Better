const db = require('./database');

class User {
    // Create a new user
    static async create({ username, email, passwordHash }) {
        const sql = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;
        
        try {
            const result = await db.run(sql, [username, email, passwordHash]);
            
            // Also create user stats entry
            await db.run(`
                INSERT INTO user_stats (user_id)
                VALUES (?)
            `, [result.id]);
            
            return result.id;
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const sql = `
            SELECT u.*, us.current_streak, us.longest_streak, us.total_habits_completed
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.email = ?
        `;
        
        return await db.get(sql, [email]);
    }

    // Find user by username
    static async findByUsername(username) {
        const sql = `
            SELECT u.*, us.current_streak, us.longest_streak, us.total_habits_completed
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.username = ?
        `;
        
        return await db.get(sql, [username]);
    }

    // Find user by ID
    static async findById(id) {
        const sql = `
            SELECT u.*, us.current_streak, us.longest_streak, us.total_habits_completed,
                   us.habits_broken, us.habits_built
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            WHERE u.id = ?
        `;
        
        return await db.get(sql, [id]);
    }

    // Update user points and level
    static async updatePointsAndLevel(userId, pointsToAdd) {
        // Get current user data
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');

        const newTotalPoints = user.total_points + pointsToAdd;
        
        // Calculate new level (simple formula: level = floor(points / 1000) + 1)
        const newLevel = Math.floor(newTotalPoints / 1000) + 1;

        const sql = `
            UPDATE users 
            SET total_points = ?, level = ?
            WHERE id = ?
        `;
        
        await db.run(sql, [newTotalPoints, newLevel, userId]);
        
        return { newTotalPoints, newLevel };
    }

    // Update user stats
    static async updateStats(userId, stats) {
        const sql = `
            UPDATE user_stats 
            SET current_streak = ?,
                longest_streak = ?,
                total_habits_completed = ?,
                habits_broken = ?,
                habits_built = ?,
                last_updated = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `;
        
        return await db.run(sql, [
            stats.current_streak,
            stats.longest_streak,
            stats.total_habits_completed,
            stats.habits_broken,
            stats.habits_built,
            userId
        ]);
    }

    // Get user leaderboard
    static async getLeaderboard(limit = 10) {
        const sql = `
            SELECT u.id, u.username, u.total_points, u.level,
                   us.current_streak, us.longest_streak, us.total_habits_completed
            FROM users u
            LEFT JOIN user_stats us ON u.id = us.user_id
            ORDER BY u.total_points DESC
            LIMIT ?
        `;
        
        return await db.query(sql, [limit]);
    }

    // Update user preferences
    static async updatePreferences(userId, preferences) {
        const sql = `
            UPDATE users 
            SET avatar_id = ?, theme_preference = ?
            WHERE id = ?
        `;
        
        return await db.run(sql, [
            preferences.avatar_id,
            preferences.theme_preference,
            userId
        ]);
    }

    // Get user achievements count
    static async getAchievementsCount(userId) {
        const sql = `
            SELECT COUNT(*) as count
            FROM user_achievements
            WHERE user_id = ?
        `;
        
        const result = await db.get(sql, [userId]);
        return result.count;
    }

    // Delete user (for GDPR compliance)
    static async delete(userId) {
        const sql = `DELETE FROM users WHERE id = ?`;
        return await db.run(sql, [userId]);
    }
}

module.exports = User;
