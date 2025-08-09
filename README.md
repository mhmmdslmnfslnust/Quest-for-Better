# HabitQuest - Gamified Wellness App

A comprehensive gamified wellness application designed to help users break bad habits and build good ones through engaging game mechanics.

## 🎮 Features

### ✅ Core Functionality (Implemented)
- **Daily Habit Tracking**: Intuitive daily completion logging with points
- **Points & Streaks**: Earn points for consistency and build streak momentum
- **Achievement System**: 19 achievements with dramatic visual discrimination
- **Challenge System**: Time-limited challenges with community competition and leave functionality
- **Advanced Analytics**: Monthly calendar view with 6-tier color system for success visualization
- **Advanced Filtering**: Search, category, difficulty, and status filters
- **Progress Visualization**: Real-time completion rates and streak counters

### ✅ Habit Management (Fully Functional)
- **Habit Categories**: Health, Productivity, Social, Mindfulness, and more
- **Break vs Build**: Track both habits to break and habits to build
- **Difficulty Levels**: 1-5 difficulty with dynamic point calculations
- **Visual Customization**: Custom colors and icons for personal organization
- **Smart Organization**: Multiple view modes with advanced sorting options

### ✅ Gamification Elements (Active)
- **Achievement Badges**: Collect 19 different achievements across 4 categories
- **Visual Rewards**: Dramatic green glow effects for earned achievements
- **Smart Sorting**: Earned achievements prominently displayed first
- **Progress Tracking**: Real-time progress with percentage indicators
- **Celebration System**: Toast notifications and shimmer animations
- **Challenge Competition**: Join community challenges with leaderboards and safe leave functionality
- **Podium Rankings**: Top 3 performers displayed with special animations
- **Monthly Analytics**: Interactive calendar with color-coded success patterns and view toggles

### 🚀 Upcoming Features
- **Social Features**: Share progress and compete with friends
- **Enhanced Gamification**: RPG elements and character progression system
- **AI-Powered Insights**: Intelligent habit recommendations and pattern analysis
- **Mobile App**: Native mobile experience with offline capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** for modern component-based UI development
- **Styled Components** for modern, responsive design with glass morphism
- **Chart.js & Recharts** for advanced data visualization and analytics
- **Framer Motion** for smooth animations and transitions
- **PWA Support** for mobile-first experience

### Backend
- **Node.js** with Express.js for RESTful API
- **SQLite** for local data persistence
- **JWT Authentication** for secure user sessions
- **bcrypt** for password encryption
- **Cors & Helmet** for security

### Database Schema
- Users, Habits, Habit_Logs, Achievements, Challenges
- Optimized for quick queries and scalability
- Built-in data validation and constraints

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mhmmdslmnfslnust/Quest-for-Better.git
cd Quest-for-Better
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Initialize database**
```bash
cd ../backend
npm run db:setup
```

4. **Start development servers**
```bash
# Terminal 1: Start backend (port 3001)
cd backend
npm run dev

# Terminal 2: Start frontend (port 3000)
cd frontend
npm start
```

5. **Open your browser**
Navigate to `http://localhost:3000` to start your wellness journey!

## 📱 Usage Guide

### Getting Started
1. **Create Account**: Sign up with email and create your wellness warrior
2. **Add Habits**: Define habits you want to break or build
3. **Set Goals**: Choose difficulty levels and target streaks
4. **Daily Check-ins**: Log your progress each day
5. **Earn Rewards**: Collect points, badges, and unlock achievements

### Habit Types
- **Break Habits**: Smoking, junk food, social media addiction, etc.
- **Build Habits**: Exercise, meditation, reading, healthy eating, etc.

### Scoring System
- **Daily Success**: 10-50 points based on habit difficulty
- **Streak Bonuses**: Multipliers for consecutive days
- **Challenge Completion**: Bonus points for special challenges
- **Achievement Unlocks**: Major point rewards for milestones

## 🎯 Roadmap

### ✅ Phase 1: Habits Management System (COMPLETED)
- ✅ Complete habit CRUD operations
- ✅ Daily habit tracking with points
- ✅ Advanced filtering and search
- ✅ Progress visualization and streaks
- ✅ Responsive glass morphism design

### ✅ Phase 2: Achievement System (COMPLETED)
- ✅ 19 achievement categories across 4 types
- ✅ Dramatic visual discrimination (earned vs locked)
- ✅ Smart filtering and sorting system
- ✅ Real-time achievement checking
- ✅ Fixed critical backend data mapping bug

### ✅ Phase 3: Complete Challenge System (COMPLETED)
- ✅ Complete challenge participation and progress tracking
- ✅ Real-time leaderboards with podium display
- ✅ Multiple challenge types (Streak, Points, Perfect Days, etc.)
- ✅ Community competition and ranking system
- ✅ Status-aware visual design with animations
- ✅ Challenge leave functionality with confirmation dialogs
- ✅ Fixed styled-components keyframe interpolation issue

### ✅ Phase 4: Advanced Analytics Dashboard (COMPLETED)
- ✅ Fixed analytics dashboard blank spaces and grid layout issues
- ✅ MonthlyCalendar component with 6-tier success rate color system
- ✅ Interactive view toggle ("Color Only" vs "Show Data" modes)
- ✅ Month navigation with comprehensive hover tooltips
- ✅ Enhanced backend API with daily breakdown endpoint
- ✅ UI-compliant design with proper color hierarchy for pattern recognition

### 🎯 Phase 5: Enhanced Social Features & Community System (Ready to Begin)
Choose from:
- 🔄 Social Features: Friend system, community interactions, and accountability partners
- 🔄 Advanced Gamification: RPG elements, character progression, and story mode
- 🔄 AI-Powered Insights: Intelligent recommendations and predictive analytics
- 🔄 Mobile App Development: React Native app with offline capabilities

### Version 2.0 (Future Vision)
- 🔮 AI-powered habit recommendations
- 🔮 Wearable device integration
- 🔮 Advanced habit psychology features
- 🔮 Mobile app with offline support

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/         # Reusable UI components
├── pages/             # Main application pages
├── services/          # API communication
├── hooks/             # Custom React hooks
├── context/           # State management
├── utils/             # Helper functions
└── styles/            # Global styles and themes
```

### Backend Structure
```
backend/
├── controllers/       # Request handlers
├── models/           # Database models
├── routes/           # API endpoints
├── middleware/       # Custom middleware
├── services/         # Business logic
└── database/         # Database setup and migrations
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Inspired by habit formation research and behavioral psychology
- Game design principles from successful wellness apps
- Open source community for amazing tools and libraries

## 📞 Support

- 📧 Email: NULL (Can contact on on my mail of this profile)
- 🐛 Issues: [GitHub Issues](https://github.com/mhmmdslmnfslnust/Quest-for-Better/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mhmmdslmnfslnust/Quest-for-Better/discussions)

---

**Start your wellness journey today! 🚀**
