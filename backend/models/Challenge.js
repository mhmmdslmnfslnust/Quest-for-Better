const db = require('./database');

class Challenge {
    // Get all active challenges
    static async getActiveChalllenges() {
        try {
            return await db.query(`
                SELECT * FROM challenges 
                WHERE is_active = 1 
                ORDER BY duration_days ASC, reward_points DESC
            `);
        } catch (error) {
            console.error('Error getting active challenges:', error);
            throw error;
        }
    }

    // Get challenge by ID
    static async getById(challengeId) {
        try {
            return await db.get(`
                SELECT * FROM challenges WHERE id = ? AND is_active = 1
            `, [challengeId]);
        } catch (error) {
            console.error('Error getting challenge by ID:', error);
            throw error;
        }
    }

    // Get user's challenges with detailed status
    static async getUserChallenges(userId) {
        try {
            return await db.query(`
                SELECT c.*, uc.started_at, uc.completed_at, uc.current_progress, uc.is_completed,
                       CASE 
                           WHEN uc.is_completed = 1 THEN 'completed'
                           WHEN datetime(uc.started_at, '+' || c.duration_days || ' days') < datetime('now') THEN 'expired'
                           ELSE 'active'
                       END as status,
                       CASE 
                           WHEN uc.is_completed = 1 THEN 100
                           ELSE ROUND((uc.current_progress * 100.0 / c.target_value), 1)
                       END as progress_percentage,
                       CASE 
                           WHEN uc.is_completed = 1 THEN 0
                           ELSE CAST((julianday(datetime(uc.started_at, '+' || c.duration_days || ' days')) - julianday('now')) AS INTEGER)
                       END as days_remaining
                FROM challenges c
                JOIN user_challenges uc ON c.id = uc.challenge_id
                WHERE uc.user_id = ?
                ORDER BY uc.is_completed ASC, uc.started_at DESC
            `, [userId]);
        } catch (error) {
            console.error('Error getting user challenges:', error);
            throw error;
        }
    }

    // Join a challenge
    static async joinChallenge(userId, challengeId) {
        try {
            // Check if challenge exists and is active
            const challenge = await this.getById(challengeId);
            if (!challenge) {
                throw new Error('Challenge not found or inactive');
            }

            // Check if user already joined this challenge
            const existingChallenge = await db.get(`
                SELECT id FROM user_challenges 
                WHERE user_id = ? AND challenge_id = ?
            `, [userId, challengeId]);

            if (existingChallenge) {
                throw new Error('Already joined this challenge');
            }

            // Join the challenge
            const result = await db.run(`
                INSERT INTO user_challenges (user_id, challenge_id)
                VALUES (?, ?)
            `, [userId, challengeId]);

            return result.id;
        } catch (error) {
            console.error('Error joining challenge:', error);
            throw error;
        }
    }

    // Update challenge progress
    static async updateProgress(userId, challengeId) {
        try {
            // Get user's challenge details
            const userChallenge = await db.get(`
                SELECT uc.*, c.*
                FROM user_challenges uc
                JOIN challenges c ON uc.challenge_id = c.id
                WHERE uc.user_id = ? AND uc.challenge_id = ? AND uc.is_completed = 0
            `, [userId, challengeId]);

            if (!userChallenge) {
                throw new Error('Challenge not found or already completed');
            }

            // Check if challenge has expired
            const expiryDate = new Date(userChallenge.started_at);
            expiryDate.setDate(expiryDate.getDate() + userChallenge.duration_days);

            if (new Date() > expiryDate) {
                throw new Error('Challenge has expired');
            }

            // Calculate new progress based on challenge type
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

                case 'habit_consistency':
                    // Count total successful habit logs since challenge started
                    const consistencyQuery = await db.get(`
                        SELECT COUNT(*) as count
                        FROM habit_logs hl
                        JOIN habits h ON hl.habit_id = h.id
                        WHERE h.user_id = ? AND hl.success = 1 AND hl.logged_at >= ?
                    `, [userId, userChallenge.started_at]);
                    newProgress = consistencyQuery ? consistencyQuery.count : 0;
                    break;

                default:
                    newProgress = userChallenge.current_progress;
            }

            // Check if challenge is completed
            const isCompleted = newProgress >= userChallenge.target_value;

            // Update progress in database
            await db.run(`
                UPDATE user_challenges
                SET current_progress = ?, 
                    is_completed = ?,
                    completed_at = CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE completed_at END
                WHERE user_id = ? AND challenge_id = ?
            `, [newProgress, isCompleted ? 1 : 0, isCompleted, userId, challengeId]);

            // Award points if completed for the first time
            if (isCompleted && userChallenge.current_progress < userChallenge.target_value) {
                await db.run(`
                    UPDATE users 
                    SET total_points = total_points + ?
                    WHERE id = ?
                `, [userChallenge.reward_points, userId]);
            }

            return {
                progress: newProgress,
                target: userChallenge.target_value,
                completed: isCompleted,
                points_awarded: isCompleted && userChallenge.current_progress < userChallenge.target_value ? userChallenge.reward_points : 0
            };
        } catch (error) {
            console.error('Error updating challenge progress:', error);
            throw error;
        }
    }

    // Get challenge leaderboard
    static async getLeaderboard(challengeId, limit = 20) {
        try {
            return await db.query(`
                SELECT u.username, uc.current_progress, uc.is_completed, uc.completed_at,
                       CASE 
                           WHEN uc.is_completed = 1 THEN 'completed'
                           WHEN datetime(uc.started_at, '+' || c.duration_days || ' days') < datetime('now') THEN 'expired'
                           ELSE 'active'
                       END as status,
                       ROUND((uc.current_progress * 100.0 / c.target_value), 1) as progress_percentage
                FROM user_challenges uc
                JOIN users u ON uc.user_id = u.id
                JOIN challenges c ON uc.challenge_id = c.id
                WHERE uc.challenge_id = ?
                ORDER BY uc.is_completed DESC, uc.current_progress DESC, uc.completed_at ASC
                LIMIT ?
            `, [challengeId, limit]);
        } catch (error) {
            console.error('Error getting challenge leaderboard:', error);
            throw error;
        }
    }

    // Get challenge statistics
    static async getChallengeStats(challengeId) {
        try {
            const stats = await db.get(`
                SELECT 
                    COUNT(*) as total_participants,
                    COUNT(CASE WHEN uc.is_completed = 1 THEN 1 END) as completed_count,
                    COUNT(CASE WHEN uc.is_completed = 0 AND datetime(uc.started_at, '+' || c.duration_days || ' days') >= datetime('now') THEN 1 END) as active_count,
                    COUNT(CASE WHEN uc.is_completed = 0 AND datetime(uc.started_at, '+' || c.duration_days || ' days') < datetime('now') THEN 1 END) as expired_count,
                    ROUND(AVG(uc.current_progress), 1) as average_progress,
                    MAX(uc.current_progress) as highest_progress
                FROM user_challenges uc
                JOIN challenges c ON uc.challenge_id = c.id
                WHERE uc.challenge_id = ?
            `, [challengeId]);

            return stats || {
                total_participants: 0,
                completed_count: 0,
                active_count: 0,
                expired_count: 0,
                average_progress: 0,
                highest_progress: 0
            };
        } catch (error) {
            console.error('Error getting challenge stats:', error);
            throw error;
        }
    }

    // Create a new challenge (admin function)
    static async create(challengeData) {
        try {
            const sql = `
                INSERT INTO challenges (name, description, duration_days, reward_points, 
                                      challenge_type, target_value, badge_emoji)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            return await db.run(sql, [
                challengeData.name,
                challengeData.description,
                challengeData.duration_days,
                challengeData.reward_points,
                challengeData.challenge_type,
                challengeData.target_value,
                challengeData.badge_emoji || '🏆'
            ]);
        } catch (error) {
            console.error('Error creating challenge:', error);
            throw error;
        }
    }

    // Calculate user's rank in a challenge
    static async getUserRank(userId, challengeId) {
        try {
            const result = await db.get(`
                SELECT COUNT(*) + 1 as rank
                FROM user_challenges uc1
                JOIN user_challenges uc2 ON uc1.challenge_id = uc2.challenge_id
                WHERE uc1.challenge_id = ? 
                AND uc1.user_id = ?
                AND (
                    uc2.is_completed > uc1.is_completed OR
                    (uc2.is_completed = uc1.is_completed AND uc2.current_progress > uc1.current_progress) OR
                    (uc2.is_completed = uc1.is_completed AND uc2.current_progress = uc1.current_progress AND uc2.completed_at < uc1.completed_at)
                )
            `, [challengeId, userId]);

            return result ? result.rank : null;
        } catch (error) {
            console.error('Error getting user rank:', error);
            throw error;
        }
    }

    // Get trending challenges (most participants)
    static async getTrendingChallenges(limit = 5) {
        try {
            return await db.query(`
                SELECT c.*, COUNT(uc.id) as participant_count,
                       COUNT(CASE WHEN uc.is_completed = 1 THEN 1 END) as completion_count
                FROM challenges c
                LEFT JOIN user_challenges uc ON c.id = uc.challenge_id
                WHERE c.is_active = 1
                GROUP BY c.id
                ORDER BY participant_count DESC, completion_count DESC
                LIMIT ?
            `, [limit]);
        } catch (error) {
            console.error('Error getting trending challenges:', error);
            throw error;
        }
    }
}

module.exports = Challenge;
