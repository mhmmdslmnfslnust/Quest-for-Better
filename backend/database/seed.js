const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'habitquest.db');
const db = new sqlite3.Database(dbPath);

// Seed data for achievements
const achievements = [
    // Beginner achievements
    { name: 'First Steps', description: 'Complete your first habit log', category: 'beginner', condition_type: 'habit_logs', condition_value: 1, points_reward: 50, badge_emoji: '👶', rarity: 'common' },
    { name: 'Getting Started', description: 'Log habits for 3 consecutive days', category: 'streak', condition_type: 'streak_days', condition_value: 3, points_reward: 100, badge_emoji: '🌱', rarity: 'common' },
    { name: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streak', condition_type: 'streak_days', condition_value: 7, points_reward: 200, badge_emoji: '⚔️', rarity: 'rare' },
    
    // Streak achievements
    { name: 'Two Week Champion', description: 'Achieve a 14-day streak', category: 'streak', condition_type: 'streak_days', condition_value: 14, points_reward: 400, badge_emoji: '🏅', rarity: 'rare' },
    { name: 'Month Master', description: 'Complete a 30-day streak', category: 'streak', condition_type: 'streak_days', condition_value: 30, points_reward: 800, badge_emoji: '👑', rarity: 'epic' },
    { name: 'Century Club', description: 'Reach a 100-day streak', category: 'streak', condition_type: 'streak_days', condition_value: 100, points_reward: 2000, badge_emoji: '💎', rarity: 'legendary' },
    
    // Points achievements
    { name: 'Point Collector', description: 'Earn your first 100 points', category: 'points', condition_type: 'total_points', condition_value: 100, points_reward: 25, badge_emoji: '💰', rarity: 'common' },
    { name: 'Point Hoarder', description: 'Accumulate 1000 points', category: 'points', condition_type: 'total_points', condition_value: 1000, points_reward: 100, badge_emoji: '💎', rarity: 'rare' },
    { name: 'Point Millionaire', description: 'Reach 10,000 points', category: 'points', condition_type: 'total_points', condition_value: 10000, points_reward: 500, badge_emoji: '🏆', rarity: 'epic' },
    
    // Habit specific achievements
    { name: 'Habit Creator', description: 'Create your first habit', category: 'habits', condition_type: 'habits_created', condition_value: 1, points_reward: 25, badge_emoji: '📝', rarity: 'common' },
    { name: 'Habit Collector', description: 'Create 5 different habits', category: 'habits', condition_type: 'habits_created', condition_value: 5, points_reward: 150, badge_emoji: '📚', rarity: 'rare' },
    { name: 'Habit Master', description: 'Successfully complete 100 habit logs', category: 'habits', condition_type: 'habit_logs', condition_value: 100, points_reward: 500, badge_emoji: '🎯', rarity: 'epic' },
    
    // Special achievements
    { name: 'Weekend Warrior', description: 'Log habits on both Saturday and Sunday', category: 'special', condition_type: 'weekend_logs', condition_value: 2, points_reward: 100, badge_emoji: '🎉', rarity: 'rare' },
    { name: 'Early Bird', description: 'Log a habit before 8 AM', category: 'special', condition_type: 'early_log', condition_value: 1, points_reward: 75, badge_emoji: '🌅', rarity: 'common' },
    { name: 'Night Owl', description: 'Log a habit after 10 PM', category: 'special', condition_type: 'late_log', condition_value: 1, points_reward: 75, badge_emoji: '🦉', rarity: 'common' },
    
    // Level achievements
    { name: 'Level Up!', description: 'Reach level 2', category: 'level', condition_type: 'user_level', condition_value: 2, points_reward: 100, badge_emoji: '⬆️', rarity: 'common' },
    { name: 'Rising Star', description: 'Reach level 5', category: 'level', condition_type: 'user_level', condition_value: 5, points_reward: 250, badge_emoji: '⭐', rarity: 'rare' },
    { name: 'Champion', description: 'Reach level 10', category: 'level', condition_type: 'user_level', condition_value: 10, points_reward: 500, badge_emoji: '🏆', rarity: 'epic' },
    
    // Secret achievements
    { name: 'Perfect Week', description: 'Complete all your habits every day for a week', category: 'secret', condition_type: 'perfect_week', condition_value: 7, points_reward: 300, badge_emoji: '✨', rarity: 'epic', is_secret: true },
    { name: 'Comeback Kid', description: 'Log a habit after missing 3 days', category: 'secret', condition_type: 'comeback', condition_value: 1, points_reward: 150, badge_emoji: '💪', rarity: 'rare', is_secret: true }
];

// Seed data for challenges
const challenges = [
    {
        name: '7-Day Challenge',
        description: 'Complete any habit for 7 consecutive days',
        duration_days: 7,
        reward_points: 200,
        challenge_type: 'streak',
        target_value: 7,
        badge_emoji: '🔥'
    },
    {
        name: 'Perfect Month',
        description: 'Log all your habits successfully for 30 days',
        duration_days: 30,
        reward_points: 1000,
        challenge_type: 'perfect_month',
        target_value: 30,
        badge_emoji: '🌟'
    },
    {
        name: 'Habit Starter',
        description: 'Create and log 3 new habits this week',
        duration_days: 7,
        reward_points: 300,
        challenge_type: 'new_habits',
        target_value: 3,
        badge_emoji: '🚀'
    },
    {
        name: 'Point Sprint',
        description: 'Earn 500 points in 5 days',
        duration_days: 5,
        reward_points: 250,
        challenge_type: 'points_sprint',
        target_value: 500,
        badge_emoji: '⚡'
    }
];

db.serialize(() => {
    // Insert achievements
    const achievementStmt = db.prepare(`
        INSERT INTO achievements (name, description, category, condition_type, condition_value, 
                                points_reward, badge_emoji, rarity, is_secret)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    achievements.forEach(achievement => {
        achievementStmt.run(
            achievement.name,
            achievement.description,
            achievement.category,
            achievement.condition_type,
            achievement.condition_value,
            achievement.points_reward,
            achievement.badge_emoji,
            achievement.rarity,
            achievement.is_secret || false
        );
    });
    achievementStmt.finalize();
    
    // Insert challenges
    const challengeStmt = db.prepare(`
        INSERT INTO challenges (name, description, duration_days, reward_points, 
                               challenge_type, target_value, badge_emoji, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);
    
    challenges.forEach(challenge => {
        challengeStmt.run(
            challenge.name,
            challenge.description,
            challenge.duration_days,
            challenge.reward_points,
            challenge.challenge_type,
            challenge.target_value,
            challenge.badge_emoji
        );
    });
    challengeStmt.finalize();
    
    console.log('Database seeded successfully!');
    console.log(`Inserted ${achievements.length} achievements`);
    console.log(`Inserted ${challenges.length} challenges`);
});

db.close();
