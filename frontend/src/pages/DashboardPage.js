import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  Calendar,
  Clock,
  Star,
  Trophy,
  Plus,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { statsAPI, habitsAPI, achievementsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const WelcomeCard = styled(motion.div)`
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }

  .welcome-content {
    position: relative;
    z-index: 2;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    opacity: 0.9;
    font-size: 16px;
  }

  .level-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
    flex-wrap: wrap;
    
    .level-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .points {
      font-weight: 600;
    }
    
    .streak-info {
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.3);
    ${props => props.$clickable && `
      border-color: var(--color-primary);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `}
  }

  ${props => props.$clickable && `
    position: relative;
    
    &::after {
      content: 'Click to view details';
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      white-space: nowrap;
      z-index: 10;
    }
    
    &:hover::after {
      opacity: 1;
    }
  `}

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
    }
    
    .value {
      text-align: right;
      
      .number {
        font-size: 24px;
        font-weight: 700;
        line-height: 1;
      }
      
      .label {
        font-size: 12px;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }

  .stat-footer {
    .description {
      font-size: 14px;
      opacity: 0.8;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;

  ${props => props.$clickable && `
    &:hover {
      color: var(--color-primary);
      transform: translateX(4px);
      
      svg {
        color: var(--color-primary);
      }
    }
  `}
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TodayHabits = styled.div`
  .habits-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const HabitItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
    
    &::after {
      content: 'Click to manage this habit';
      position: absolute;
      right: -180px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10;
      opacity: 1;
    }
  }

  .habit-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: ${props => props.color || 'var(--color-primary)'};
    flex-shrink: 0;
  }

  .habit-info {
    flex: 1;
    
    .name {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--color-text-primary);
    }
    
    .type {
      font-size: 12px;
      opacity: 0.7;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }

  .habit-status {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .status-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.completed {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
      }
      
      &.failed {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      }
      
      &.pending {
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-text-secondary);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
    }
    
    .status-text {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
  }
`;

const QuickActions = styled.div`
  .actions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: var(--color-text-primary);
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .description {
      font-size: 14px;
      opacity: 0.7;
    }
  }
`;

const ProgressMomentum = styled.div`
  .momentum-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const StreakCard = styled(motion.div)`
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .streak-visual {
    text-align: center;
    margin-bottom: 16px;
  }

  .streak-number {
    font-size: 48px;
    font-weight: 900;
    line-height: 1;
  }

  .streak-label {
    font-size: 14px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .streak-progress {
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .next-milestone {
      font-size: 12px;
      text-align: center;
      opacity: 0.8;
    }
  }
`;

const InsightCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .insight-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--color-warning);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .insight-content {
    flex: 1;
  }

  .insight-title {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 4px;
  }

  .insight-text {
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1.4;
  }
`;

const AchievementCard = styled(motion.div)`
  background: linear-gradient(135deg, var(--color-warning) 0%, #f39c12 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .achievement-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .achievement-content {
    flex: 1;
  }

  .achievement-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.9;
    margin-bottom: 4px;
  }

  .achievement-name {
    font-weight: 600;
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--color-text-secondary);
  
  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h3 {
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }
`;

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [todayHabits, setTodayHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Dashboard: Loading dashboard data...');
      
      const [dashboardResponse, habitsResponse] = await Promise.all([
        statsAPI.getDashboard(),
        habitsAPI.getTodayHabitsStatus()
      ]);

      console.log('🔍 Dashboard: Raw API responses:', {
        dashboard: dashboardResponse,
        habits: habitsResponse
      });

      // The API interceptor already extracts the data, so we get the data directly
      if (dashboardResponse) {
        console.log('🔍 Dashboard: Setting dashboard data:', dashboardResponse);
        setDashboardData(dashboardResponse);
      }

      if (habitsResponse) {
        console.log('🔍 Dashboard: Setting habits data:', habitsResponse);
        setTodayHabits(habitsResponse);
      }

      // Refresh user data to get latest points/level
      await refreshUser();
    } catch (error) {
      console.error('❌ Dashboard: Failed to load dashboard data:', error);
      // Set empty data on error to show empty states instead of loading forever
      setDashboardData({});
      setTodayHabits([]);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleNavigateToHabits = () => navigate('/habits');
  const handleNavigateToAchievements = () => navigate('/achievements');
  const handleNavigateToStats = () => navigate('/stats');
  const handleNavigateToChallenges = () => navigate('/challenges');
  const handleNavigateToHabit = (habitId) => {
    // Navigate to habits page and could potentially scroll to specific habit
    navigate('/habits', { state: { highlightHabitId: habitId } });
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  const stats = dashboardData || {};
  const userStats = stats.user || {};
  const todayStats = stats.today || {};
  const weekStats = stats.week || {};

  console.log('🔍 Dashboard: Render data:', {
    dashboardData,
    todayHabits,
    todayHabitsLength: todayHabits.length,
    stats,
    todayStats,
    loading
  });

  const statCards = [
    {
      icon: Target,
      iconBg: 'var(--color-primary)',
      value: todayStats.completion_rate || 0,
      label: 'Today\'s Progress',
      description: `${todayStats.completed_habits || 0}/${todayStats.total_habits || 0} habits completed`,
      unit: '%',
      clickable: true,
      onClick: handleNavigateToHabits,
      navigationHint: 'View and manage your habits'
    },
    {
      icon: Zap,
      iconBg: 'var(--color-secondary)',
      value: weekStats.success_rate || 0,
      label: 'Week Performance',
      description: 'This week\'s success rate',
      unit: '%',
      clickable: true,
      onClick: handleNavigateToStats,
      navigationHint: 'View detailed analytics'
    },
    {
      icon: TrendingUp,
      iconBg: 'var(--color-accent)',
      value: userStats.total_points || 0,
      label: 'Total Points',
      description: 'Lifetime wellness points',
      unit: '',
      clickable: true,
      onClick: handleNavigateToStats,
      navigationHint: 'View your progress history'
    },
    {
      icon: Calendar,
      iconBg: 'var(--color-warning)',
      value: todayHabits.length,
      label: 'Active Habits',
      description: 'Habits you\'re tracking',
      unit: '',
      clickable: true,
      onClick: handleNavigateToHabits,
      navigationHint: 'Manage your habits'
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <WelcomeCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-content">
            <h1>Welcome back, {user?.username}! 🎯</h1>
            <p>
              {todayStats.completion_rate >= 80 
                ? "You're absolutely killing it today! 🔥" 
                : todayStats.completion_rate >= 50
                ? "Great momentum! Keep pushing forward! 💪"
                : userStats.current_streak > 0
                ? "Your streak is waiting - let's make today count! ⚡"
                : "Ready to start your wellness adventure? Let's go! 🌟"
              }
            </p>
            <div className="level-info">
              <div className="level-badge">
                <Star size={16} />
                Level {user?.level || 1}
              </div>
              <div className="points">
                {user?.total_points || 0} total points
              </div>
              {userStats.current_streak > 0 && (
                <div className="streak-info">
                  🔥 {userStats.current_streak} day streak
                </div>
              )}
            </div>
          </div>
        </WelcomeCard>
      </Header>

      <StatsGrid>
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            $clickable={stat.clickable}
            onClick={stat.clickable ? stat.onClick : undefined}
            title={stat.clickable ? stat.navigationHint : undefined}
          >
            <div className="stat-header">
              <div className="icon" style={{ background: stat.iconBg }}>
                <stat.icon size={24} />
              </div>
              <div className="value">
                <div className="number">{stat.value}{stat.unit}</div>
                <div className="label">{stat.label}</div>
              </div>
            </div>
            <div className="stat-footer">
              <div className="description">{stat.description}</div>
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <TodayHabits>
          <SectionTitle $clickable onClick={handleNavigateToHabits}>
            <Target size={24} />
            Today's Focus
          </SectionTitle>
          
          {todayHabits.length > 0 ? (
            todayHabits.filter(habit => !habit.logged_today || !habit.completed_today).length > 0 ? (
              <div className="habits-list">
                {todayHabits.filter(habit => !habit.logged_today || !habit.completed_today).slice(0, 3).map((habit, index) => {
                // Determine the actual status based on logged_today and completed_today
                const getHabitStatus = () => {
                  if (!habit.logged_today) return 'pending';
                  return habit.completed_today ? 'completed' : 'failed';
                };

                const getStatusIcon = () => {
                  const status = getHabitStatus();
                  switch (status) {
                    case 'completed':
                      return <CheckCircle size={16} />;
                    case 'failed':
                      return <X size={16} />;
                    default:
                      return <Clock size={16} />;
                  }
                };

                const getStatusText = () => {
                  const status = getHabitStatus();
                  switch (status) {
                    case 'completed':
                      return 'Completed';
                    case 'failed':
                      return 'Not done';
                    default:
                      return 'Pending';
                  }
                };

                return (
                  <HabitItem
                    key={habit.id}
                    color={habit.color}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleNavigateToHabit(habit.id)}
                  >
                    <div className="habit-icon">
                      {habit.icon}
                    </div>
                    <div className="habit-info">
                      <div className="name">{habit.name}</div>
                      <div className="type">
                        {habit.type === 'build' ? 'Build Habit' : 'Break Habit'}
                      </div>
                    </div>
                    <div className="habit-status">
                      <div className={`status-icon ${getHabitStatus()}`}>
                        {getStatusIcon()}
                      </div>
                      <div className="status-text">
                        {getStatusText()}
                      </div>
                    </div>
                  </HabitItem>
                );
              })}
            </div>
            ) : (
              <EmptyState>
                <div className="icon">
                  <Target size={32} />
                </div>
                <h3>All done for today! 🎉</h3>
                <p>You've completed all your habits. Amazing work!</p>
              </EmptyState>
            )
          ) : (
            <EmptyState>
              <div className="icon">
                <Target size={32} />
              </div>
              <h3>Ready to start? ⚡</h3>
              <p>Create your first habit to begin your wellness journey!</p>
            </EmptyState>
          )}
        </TodayHabits>

        <ProgressMomentum>
          <SectionTitle>
            <TrendingUp size={24} />
            Your Momentum
          </SectionTitle>
          
          <div className="momentum-content">
            <StreakCard
              onClick={handleNavigateToStats}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="streak-visual">
                <div className="streak-number">{userStats.current_streak || 0}</div>
                <div className="streak-label">Day Streak</div>
              </div>
              <div className="streak-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.min(((userStats.current_streak || 0) % 7) / 7 * 100, 100)}%`
                  }}></div>
                </div>
                <div className="next-milestone">
                  {userStats.current_streak >= 7 ? 'Amazing streak! 🔥' : `${7 - (userStats.current_streak || 0)} days to weekly milestone`}
                </div>
              </div>
            </StreakCard>

            <InsightCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="insight-icon">
                <Star size={20} />
              </div>
              <div className="insight-content">
                <div className="insight-title">Smart Insight</div>
                <div className="insight-text">
                  {todayStats.completion_rate >= 80 
                    ? "You're crushing it today! Keep this momentum going! 🚀"
                    : todayStats.completion_rate >= 50
                    ? "Good progress! Complete 1 more habit to boost your day 💪"
                    : "Every journey starts with a single step. You've got this! 🌟"
                  }
                </div>
              </div>
            </InsightCard>

            {stats.achievements_count > 0 && (
              <AchievementCard
                onClick={handleNavigateToAchievements}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="achievement-icon">
                  <Trophy size={24} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-title">Achievements Earned</div>
                  <div className="achievement-name">{stats.achievements_count} badges unlocked!</div>
                </div>
              </AchievementCard>
            )}
          </div>
        </ProgressMomentum>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
