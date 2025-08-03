const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'habitquest.db');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
    try {
        fs.unlinkSync(dbPath);
        console.log('Existing database removed');
    } catch (error) {
        if (error.code === 'EBUSY') {
            console.log('Database file is locked, will recreate tables instead...');
        } else {
            throw error;
        }
    }
}

const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            level INTEGER DEFAULT 1,
            total_points INTEGER DEFAULT 0,
            avatar_id INTEGER DEFAULT 1,
            theme_preference TEXT DEFAULT 'default'
        )
    `);

    // Habits table
    db.run(`
        CREATE TABLE habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('break', 'build')),
            difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
            target_frequency INTEGER DEFAULT 1,
            points_per_success INTEGER NOT NULL,
            color TEXT DEFAULT '#6366f1',
            icon TEXT DEFAULT '🎯',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    // Habit logs table
    db.run(`
        CREATE TABLE habit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            date DATE NOT NULL,
            success BOOLEAN NOT NULL,
            notes TEXT,
            points_earned INTEGER DEFAULT 0,
            streak_day INTEGER DEFAULT 0,
            logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
            UNIQUE(habit_id, date)
        )
    `);

    // Achievements table
    db.run(`
        CREATE TABLE achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            condition_type TEXT NOT NULL,
            condition_value INTEGER NOT NULL,
            points_reward INTEGER NOT NULL,
            badge_emoji TEXT NOT NULL,
            badge_color TEXT DEFAULT '#gold',
            rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
            is_secret BOOLEAN DEFAULT false
        )
    `);

    // User achievements table
    db.run(`
        CREATE TABLE user_achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            achievement_id INTEGER NOT NULL,
            earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (achievement_id) REFERENCES achievements (id) ON DELETE CASCADE,
            UNIQUE(user_id, achievement_id)
        )
    `);

    // Challenges table
    db.run(`
        CREATE TABLE challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            duration_days INTEGER NOT NULL,
            reward_points INTEGER NOT NULL,
            challenge_type TEXT NOT NULL,
            target_value INTEGER NOT NULL,
            start_date DATE,
            end_date DATE,
            is_active BOOLEAN DEFAULT true,
            badge_emoji TEXT DEFAULT '🏆'
        )
    `);

    // User challenges table
    db.run(`
        CREATE TABLE user_challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            challenge_id INTEGER NOT NULL,
            started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            current_progress INTEGER DEFAULT 0,
            is_completed BOOLEAN DEFAULT false,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE,
            UNIQUE(user_id, challenge_id)
        )
    `);

    // User stats table for caching
    db.run(`
        CREATE TABLE user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            total_habits_completed INTEGER DEFAULT 0,
            habits_broken INTEGER DEFAULT 0,
            habits_built INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    console.log('Database tables created successfully!');
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database setup completed successfully!');
    }
});
