# HabitQuest - Project Architecture & File Structure

## 📁 Complete Project Structure

```
Quest-for-Better/
├── README.md                          # Main project documentation
├── install.bat                        # Windows installation script
├── install.sh                         # Unix/Linux installation script
├── PHASE_1_COMPLETION_REPORT.md       # Phase 1 completion documentation
├── DEVELOPMENT_ROADMAP.md             # Development phases and roadmap
├── PROJECT_STRUCTURE.md               # This file - project architecture
├── 
├── backend/                           # Node.js/Express API Server
│   ├── package.json                   # Backend dependencies
│   ├── server.js                      # Main server file
│   ├── .env.example                   # Environment variables template
│   │
│   ├── database/                      # Database setup and management
│   │   ├── setup.js                   # Database initialization
│   │   ├── seed.js                    # Seed data for achievements/challenges
│   │   └── habitquest.db              # SQLite database file (created on setup)
│   │
│   ├── middleware/                    # Express middleware
│   │   └── auth.js                    # Authentication & utility functions
│   │
│   ├── models/                        # Database models
│   │   ├── database.js                # Database connection wrapper
│   │   ├── User.js                    # User model with methods
│   │   ├── Habit.js                   # ✅ PHASE 1 - Habit model with enhanced methods
│   │   └── Achievement.js             # 🚀 PHASE 2 - Achievement checking logic
│   │
│   └── routes/                        # API route handlers
│       ├── auth.js                    # Authentication routes
│       ├── habits.js                  # ✅ PHASE 1 - Enhanced habit management routes
│       ├── achievements.js            # 🚀 PHASE 2 - Achievement system routes (enhanced)
│       ├── challenges.js              # Challenge system routes
│       └── stats.js                   # Statistics and analytics routes
│
├── frontend/                          # React.js Frontend Application
│   ├── package.json                   # Frontend dependencies
│   ├── public/                        # Static public files
│   │   ├── index.html                 # Main HTML template
│   │   └── manifest.json              # PWA manifest
│   │
│   └── src/                           # React source code
│       ├── index.js                   # React app entry point
│       ├── App.js                     # Main app component with routing
│       │
│       ├── components/                # Reusable React components
│       │   ├── Layout.js              # Main app layout with sidebar
│       │   ├── LoadingSpinner.js      # Loading component
│       │   │
│       │   ├── habits/                # ✅ PHASE 1 COMPLETED - Habit Management Components
│       │   │   ├── CreateHabitModal.js # Habit creation/editing modal with validation
│       │   │   ├── HabitCard.js       # Individual habit display with stats & actions
│       │   │   ├── HabitFilters.js    # Advanced filtering, sorting & search
│       │   │   └── HabitTrackingButton.js # Daily completion tracking
│       │   │
│       │   └── achievements/          # ✅ PHASE 2 COMPLETED - Achievement System Components
│       │       ├── AchievementCard.js # ✅ Individual achievement display with dramatic visual states
│       │       ├── AchievementModal.js # ✅ Detailed achievement view
│       │       ├── AchievementGallery.js # ✅ Main achievements grid
│       │       ├── CategoryFilter.js  # ✅ NEW - Hybrid filtering with status toggles
│       │       ├── ProgressRing.js    # ✅ Circular progress indicator  
│       │       ├── RarityBadge.js     # ✅ Achievement rarity indicator
│       │       └── AchievementToast.js # ✅ Unlock notification component
│       │
│       ├── pages/                     # Main page components
│       │   ├── LandingPage.js         # Marketing landing page
│       │   ├── LoginPage.js           # User login page
│       │   ├── RegisterPage.js        # User registration page
│       │   ├── DashboardPage.js       # Main dashboard
│       │   ├── HabitsPage.js          # ✅ PHASE 1 COMPLETED - Full habit management page
│       │   ├── AchievementsPage.js    # ✅ PHASE 2 COMPLETED - Achievement gallery with visual enhancement
│       │   ├── ChallengesPage.js      # 🎯 PHASE 3 - Challenges page (placeholder)
│       │   ├── StatsPage.js           # 🎯 PHASE 3 - Statistics and analytics (placeholder)
│       │   └── ProfilePage.js         # User profile management
│       │
│       ├── context/                   # React Context providers
│       │   ├── AuthContext.js         # Authentication state management
│       │   └── ThemeContext.js        # Theme and appearance management
│       │
│       ├── hooks/                     # Custom React hooks
│       │   ├── useHabits.js           # ✅ PHASE 1 - Habit state management & API calls
│       │   └── useAchievements.js     # ✅ PHASE 2 - Achievement state management with smart sorting
│       │
│       ├── services/                  # API communication
│       │   └── api.js                 # Axios API client with all endpoints
│       │
│       └── styles/                    # Global styling
│           └── globals.css            # Global CSS styles and utilities
│
└── docs/                              # Documentation
    ├── PHASE_1_COMPLETION_REPORT.md   # ✅ Phase 1 completion documentation
    ├── PHASE_2_COMPLETION_REPORT.md   # ✅ Phase 2 completion documentation  
    ├── API.md                         # API documentation (to be created)
    ├── DEPLOYMENT.md                  # Deployment guide (to be created)
    └── CONTRIBUTING.md                # Contribution guidelines (to be created)
```

## 🗄️ Database Schema

### Tables Structure

#### users
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `created_at` (DATETIME)
- `level` (INTEGER, default: 1)
- `total_points` (INTEGER, default: 0)
- `avatar_id` (INTEGER, default: 1)
- `theme_preference` (TEXT, default: 'default')

#### habits
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT: health, productivity, social, mindfulness, etc.)
- `type` (TEXT: 'break' or 'build')
- `difficulty` (INTEGER: 1-5)
- `target_frequency` (INTEGER, default: 1)
- `points_per_success` (INTEGER)
- `color` (TEXT, default: '#6366f1')
- `icon` (TEXT, default: '🎯')
- `created_at` (DATETIME)
- `is_active` (BOOLEAN, default: true)

#### habit_logs
- `id` (INTEGER PRIMARY KEY)
- `habit_id` (INTEGER, FOREIGN KEY)
- `date` (DATE)
- `success` (BOOLEAN)
- `notes` (TEXT)
- `points_earned` (INTEGER)
- `streak_day` (INTEGER)
- `logged_at` (DATETIME)
- UNIQUE constraint on (habit_id, date)

#### achievements
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `condition_type` (TEXT)
- `condition_value` (INTEGER)
- `points_reward` (INTEGER)
- `badge_emoji` (TEXT)
- `badge_color` (TEXT)
- `rarity` (TEXT: common, rare, epic, legendary)
- `is_secret` (BOOLEAN, default: false)

#### user_achievements
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `achievement_id` (INTEGER, FOREIGN KEY)
- `earned_at` (DATETIME)
- UNIQUE constraint on (user_id, achievement_id)

#### challenges
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `description` (TEXT)
- `duration_days` (INTEGER)
- `reward_points` (INTEGER)
- `challenge_type` (TEXT)
- `target_value` (INTEGER)
- `start_date` (DATE)
- `end_date` (DATE)
- `is_active` (BOOLEAN)
- `badge_emoji` (TEXT)

#### user_challenges
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `challenge_id` (INTEGER, FOREIGN KEY)
- `started_at` (DATETIME)
- `completed_at` (DATETIME)
- `current_progress` (INTEGER)
- `is_completed` (BOOLEAN)
- UNIQUE constraint on (user_id, challenge_id)

#### user_stats
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER UNIQUE, FOREIGN KEY)
- `current_streak` (INTEGER, default: 0)
- `longest_streak` (INTEGER, default: 0)
- `total_habits_completed` (INTEGER, default: 0)
- `habits_broken` (INTEGER, default: 0)
- `habits_built` (INTEGER, default: 0)
- `last_updated` (DATETIME)

## 🎮 Game Mechanics

### Points System
- **Base Points**: 10-60 points per habit based on difficulty (1-5)
- **Streak Bonus**: +10% for every 7-day streak
- **Challenge Bonus**: Extra points for completing challenges
- **Achievement Rewards**: Bonus points for unlocking achievements

### Level System
- Level 1: 0-99 points
- Level 2: 100-299 points
- Level 3: 300-599 points
- Level 4: 600-999 points
- Level 5+: +1000 points per level

### Achievement Categories
- **Beginner**: First steps and early milestones
- **Streak**: Consecutive day achievements
- **Points**: Total points milestones
- **Habits**: Habit creation and completion
- **Special**: Weekend, early bird, night owl
- **Level**: User level milestones
- **Secret**: Hidden achievements for special conditions

## 🚀 Phase Development Status

### ✅ Phase 1: Habits Management System (COMPLETED)
**Implementation Date**: August 3, 2025  
**Status**: Fully functional and production-ready

#### Frontend Components Created:
- `frontend/src/components/habits/HabitCard.js` - Beautiful habit display with stats & actions
- `frontend/src/components/habits/HabitTrackingButton.js` - Interactive daily completion tracking
- `frontend/src/components/habits/CreateHabitModal.js` - Comprehensive habit creation/editing modal
- `frontend/src/components/habits/HabitFilters.js` - Advanced filtering, sorting & search system
- `frontend/src/hooks/useHabits.js` - Custom hook for habit state management and API calls
- `frontend/src/pages/HabitsPage.js` - Completely rewritten with full functionality

#### Backend Enhancements:
- `backend/routes/habits.js` - Enhanced API endpoints with better data structure
- `backend/models/Habit.js` - Added missing methods for streak calculation and logging

#### Features Delivered:
- ✅ Complete CRUD Operations (Create, Read, Update, Delete habits)
- ✅ Daily Habit Tracking with points and streak calculation
- ✅ Advanced Filtering (search, category, difficulty, status)
- ✅ Progress Visualization (streaks, completion rates, points)
- ✅ Responsive Design (works on all screen sizes)
- ✅ Real-time Updates with toast notifications
- ✅ Error Handling and loading states
- ✅ Glass morphism design matching existing theme

### ✅ Phase 2: Achievement System with Visual Enhancement (COMPLETED)
**Implementation Date**: August 3, 2025  
**Status**: Fully functional with dramatic visual discrimination

#### Phase 2.0: Core Achievement System ✅
**Frontend Components Created:**
- `frontend/src/components/achievements/AchievementCard.js` - ✅ Individual achievement display with dramatic visual states
- `frontend/src/components/achievements/AchievementModal.js` - ✅ Detailed achievement view with progress info
- `frontend/src/components/achievements/AchievementGallery.js` - ✅ Main achievements grid with responsive layout
- `frontend/src/components/achievements/CategoryFilter.js` - ✅ **NEW** Hybrid filtering with status toggles
- `frontend/src/components/achievements/ProgressRing.js` - ✅ Circular progress indicator
- `frontend/src/components/achievements/RarityBadge.js` - ✅ Achievement rarity indicator
- `frontend/src/components/achievements/AchievementToast.js` - ✅ Unlock notification component
- `frontend/src/hooks/useAchievements.js` - ✅ Achievement state management with smart sorting
- `frontend/src/pages/AchievementsPage.js` - ✅ Complete implementation with enhanced statistics

**Backend Enhancements:**
- `backend/models/Achievement.js` - ✅ Achievement checking, awarding logic + **FIXED critical field mapping bug**
- `backend/routes/achievements.js` - ✅ Enhanced endpoints with progress tracking

#### Phase 2.5: Visual Discrimination Enhancement ✅
**Problem Solved:** Achievement showing 100% complete but appearing as "Locked"
**Root Cause:** Field mapping bug (`ua.achievement_id` → `ua.id`) in backend progress calculation
**Solution:** Fixed backend logic + implemented dramatic visual discrimination system

#### Features Delivered:
- ✅ **Critical Bug Fix**: Resolved achievement display issue affecting all earned achievements
- ✅ **Dramatic Visual States**: Green glow effects for earned, grayscale for locked achievements
- ✅ **Hybrid Filtering System**: Status toggles (Earned/Locked/Close/All) + category filters
- ✅ **Smart Sorting Logic**: Earned achievements prioritized first, then by progress percentage
- ✅ **Enhanced Statistics**: Status-based counts with earned/locked/close metrics
- ✅ **Theme Consistency**: Visual enhancements work across all 5 theme variations
- ✅ **19 Seeded Achievements**: Across 4 categories (Health, Productivity, Social, Consistency)
- ✅ **Real-time Achievement Checking**: Automatic awarding when habits are completed
- ✅ **Celebration Animations**: CSS keyframes with shimmer effects for earned achievements
- ✅ **Duplicate Protection**: Safeguard against duplicate achievement awards

#### Achievement Categories Implemented:
- **🏃 Health** (4 achievements): Workout streaks, fitness milestones
- **📚 Productivity** (5 achievements): Study sessions, learning goals  
- **� Social** (4 achievements): Community engagement, sharing
- **⚡ Consistency** (6 achievements): Streak-based accomplishments

### 🎯 Phase 3: Next Development Options (READY TO PLAN)
**Status**: Achievement system complete - ready to choose next feature set

#### Option A: Challenge System 🏆
- Time-limited challenges with community competition
- Leaderboards and progress tracking
- Weekly/Monthly challenge rotations

#### Option B: Advanced Analytics 📊
- Comprehensive analytics dashboard with Chart.js
- Habit pattern analysis and insights
- Performance trend visualization

#### Option C: Social Features 🤝
- Friend system and social connections
- Achievement sharing and community features
- Group challenges and accountability

#### Option D: Enhanced Gamification 🎮
- Character progression and RPG elements
- Unlockable themes and customizations
- Story mode with guided habit building

### Challenge Types
- **Streak Challenges**: Maintain habits for X days
- **Point Sprints**: Earn X points in Y days
- **Perfect Periods**: Complete all habits for X days
- **New Habit Challenges**: Create and maintain new habits

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Database**: SQLite 3 (with sqlite3 npm package)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Logging**: morgan
- **Environment**: dotenv

### Frontend Technologies
- **Framework**: React 18
- **Routing**: React Router DOM 6
- **Styling**: Styled Components 6
- **Animations**: Framer Motion 10
- **Charts**: Chart.js 4 + react-chartjs-2
- **HTTP Client**: Axios 1.6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Create React App (Frontend), Nodemon (Backend)
- **Code Quality**: ESLint, Prettier (to be configured)
- **Testing**: Jest (to be implemented)

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /verify` - Token verification
- `GET /profile` - Get user profile
- `PUT /preferences` - Update user preferences
- `DELETE /account` - Delete user account

### Habits (`/api/habits`)
- `GET /` - Get all user habits
- `GET /today` - Get today's habit status
- `POST /` - Create new habit
- `GET /:id` - Get specific habit
- `PUT /:id` - Update habit
- `DELETE /:id` - Delete habit
- `POST /:id/log` - Log habit completion
- `GET /:id/logs` - Get habit logs
- `GET /category/:category` - Get habits by category

### Achievements (`/api/achievements`)
- `GET /` - Get all achievements
- `GET /user` - Get user's achievements
- `POST /check` - Check and award new achievements
- `GET /progress` - Get achievement progress

### Challenges (`/api/challenges`)
- `GET /` - Get all active challenges
- `GET /user` - Get user's challenges
- `POST /:id/join` - Join a challenge
- `POST /:id/progress` - Update challenge progress
- `GET /:id/leaderboard` - Get challenge leaderboard

### Statistics (`/api/stats`)
- `GET /dashboard` - Get dashboard statistics
- `GET /habits` - Get habit analytics
- `GET /streaks` - Get streak analytics
- `GET /leaderboard` - Get user leaderboards

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Gradient themes (Default, Dark, Forest, Ocean, Sunset)
- **Typography**: Inter font family
- **Components**: Glass morphism design with backdrop blur
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design approach

### Key Features
- **Gamification**: Points, levels, badges, achievements
- **Progress Tracking**: Visual charts and statistics
- **Habit Management**: Create, edit, delete, categorize habits
- **Daily Logging**: Simple success/failure tracking
- **Streak Visualization**: Current and best streaks
- **Achievement System**: Unlock badges and rewards
- **Challenge System**: Time-limited group activities
- **Social Elements**: Leaderboards and progress sharing
- **Theme Customization**: Multiple visual themes
- **Mobile Responsive**: Works on all device sizes

## 📱 Progressive Web App Features

### PWA Capabilities
- **Installable**: Can be installed on mobile devices
- **Offline Ready**: Service worker for offline functionality (to be implemented)
- **Push Notifications**: Habit reminders (to be implemented)
- **Native Feel**: App-like experience on mobile

### Performance Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Efficient image loading
- **Caching Strategy**: Smart caching for better performance
- **Bundle Optimization**: Minimized JavaScript bundles

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Automatic token expiry
- **Rate Limiting**: API request rate limiting
- **CORS Protection**: Cross-origin request protection
- **Helmet Security**: Security headers middleware

### Data Protection
- **Input Validation**: express-validator for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **GDPR Compliance**: User data deletion capability

## 🚀 Deployment Options

### Development Environment
- **Local Development**: npm run dev for both frontend and backend
- **Database**: SQLite file-based database
- **Environment Variables**: .env file configuration

### Production Deployment Options
1. **Heroku**: Easy deployment with PostgreSQL addon
2. **Vercel/Netlify**: Frontend deployment with serverless functions
3. **DigitalOcean**: VPS deployment with PM2
4. **AWS**: EC2 with RDS database
5. **Docker**: Containerized deployment

## 📈 Future Enhancements

### Planned Features (v1.1)
- Social features and friend system
- Community challenges and competitions
- Advanced analytics and insights
- Mobile app (React Native)
- AI-powered habit recommendations

### Advanced Features (v2.0)
- VR/AR integration for immersive experiences
- Wearable device synchronization
- Therapist collaboration tools
- Advanced habit psychology features
- Machine learning for personalized recommendations

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📞 Support & Contact

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and API docs
- **Community**: Discord server for discussions (to be created)
- **Email Support**: Direct support channel

---

**HabitQuest transforms the boring task of habit tracking into an exciting adventure. Start your wellness journey today!** 🎯✨
