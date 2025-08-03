const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'habitquest.db');
const db = new sqlite3.Database(dbPath);

// Seed data for achievements
const achievements = [
    // 🔥 Streak Achievements
    { name: 'Getting Started', description: 'Complete habits for 1 day', category: 'streak', condition_type: 'streak', condition_value: 1, points_reward: 25, badge_emoji: '�', badge_color: '#ff6b35', rarity: 'common' },
    { name: 'Building Momentum', description: 'Maintain a 3-day streak', category: 'streak', condition_type: 'streak', condition_value: 3, points_reward: 50, badge_emoji: '🔥', badge_color: '#ff6b35', rarity: 'common' },
    { name: 'Week Warrior', description: 'Achieve a 7-day streak', category: 'streak', condition_type: 'streak', condition_value: 7, points_reward: 100, badge_emoji: '🔥', badge_color: '#ff6b35', rarity: 'rare' },
    { name: 'Month Master', description: 'Complete a 30-day streak', category: 'streak', condition_type: 'streak', condition_value: 30, points_reward: 500, badge_emoji: '🔥', badge_color: '#ff6b35', rarity: 'epic' },
    { name: 'Habit Hero', description: 'Maintain a 60-day streak', category: 'streak', condition_type: 'streak', condition_value: 60, points_reward: 1000, badge_emoji: '�', badge_color: '#ff6b35', rarity: 'epic' },
    { name: 'Legendary Streaker', description: 'Reach a 100-day streak', category: 'streak', condition_type: 'streak', condition_value: 100, points_reward: 2000, badge_emoji: '�', badge_color: '#ff6b35', rarity: 'legendary' },
    
    // 💰 Point Achievements  
    { name: 'First Steps', description: 'Earn your first 100 points', category: 'points', condition_type: 'total_points', condition_value: 100, points_reward: 25, badge_emoji: '�', badge_color: '#6366f1', rarity: 'common' },
    { name: 'Rising Star', description: 'Accumulate 500 points', category: 'points', condition_type: 'total_points', condition_value: 500, points_reward: 100, badge_emoji: '💎', badge_color: '#6366f1', rarity: 'common' },
    { name: 'Point Collector', description: 'Reach 1,000 points', category: 'points', condition_type: 'total_points', condition_value: 1000, points_reward: 250, badge_emoji: '💎', badge_color: '#6366f1', rarity: 'rare' },
    { name: 'Elite Scorer', description: 'Achieve 5,000 points', category: 'points', condition_type: 'total_points', condition_value: 5000, points_reward: 1000, badge_emoji: '�', badge_color: '#6366f1', rarity: 'epic' },
    { name: 'Point Legend', description: 'Accumulate 25,000 points', category: 'points', condition_type: 'total_points', condition_value: 25000, points_reward: 5000, badge_emoji: '�', badge_color: '#6366f1', rarity: 'legendary' },
    
    // 🎯 Habit-Specific Achievements
    { name: 'Habit Creator', description: 'Create your first 5 habits', category: 'habits', condition_type: 'habits_created', condition_value: 5, points_reward: 100, badge_emoji: '🎯', badge_color: '#10b981', rarity: 'common' },
    { name: 'Variety Seeker', description: 'Try 3 different categories', category: 'habits', condition_type: 'category_variety', condition_value: 3, points_reward: 200, badge_emoji: '�', badge_color: '#10b981', rarity: 'rare' },
    { name: 'Consistency King', description: 'Complete 50 habit logs', category: 'habits', condition_type: 'habits_completed', condition_value: 50, points_reward: 750, badge_emoji: '�', badge_color: '#10b981', rarity: 'epic' },
    { name: 'Master Builder', description: 'Complete 200 habit logs', category: 'habits', condition_type: 'habits_completed', condition_value: 200, points_reward: 1500, badge_emoji: '🎯', badge_color: '#10b981', rarity: 'legendary' },
    
    // 🌟 Special Achievements
    { name: 'Early Bird', description: 'Complete a habit before 7 AM', category: 'special', condition_type: 'early_bird', condition_value: 1, points_reward: 200, badge_emoji: '🌅', badge_color: '#f59e0b', rarity: 'rare' },
    { name: 'Night Owl', description: 'Complete a habit after 10 PM', category: 'special', condition_type: 'night_owl', condition_value: 1, points_reward: 200, badge_emoji: '�', badge_color: '#8b5cf6', rarity: 'rare' },
    { name: 'Perfect Week', description: 'Complete all habits for 7 days', category: 'special', condition_type: 'perfect_week', condition_value: 7, points_reward: 500, badge_emoji: '⭐', badge_color: '#fbbf24', rarity: 'epic' },
    { name: 'Comeback Kid', description: 'Restart after a 7+ day break', category: 'special', condition_type: 'comeback', condition_value: 1, points_reward: 100, badge_emoji: '💪', badge_color: '#ef4444', rarity: 'common' }
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
