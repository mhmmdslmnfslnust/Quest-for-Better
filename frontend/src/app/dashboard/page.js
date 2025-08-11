'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    background: ${props => props.$color || 'var(--color-primary)'};
    color: white;
  }

  .value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .label {
    color: var(--color-text-secondary);
    font-size: 14px;
  }

  .change {
    font-size: 12px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.positive { color: var(--color-accent); }
    &.negative { color: var(--color-danger); }
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${props => props.$color || 'var(--color-primary)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
`;

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      // Simulate loading dashboard data
      setTimeout(() => {
        setDashboardData({
          totalHabits: 8,
          completedToday: 6,
          currentStreak: 12,
          totalPoints: user?.total_points || 1250
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading || isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner message="Redirecting..." />;
  }

  const stats = [
    {
      icon: Target,
      value: dashboardData?.totalHabits || 0,
      label: 'Active Habits',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: '+2 this week'
    },
    {
      icon: CheckCircle,
      value: dashboardData?.completedToday || 0,
      label: 'Completed Today',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: '75% completion'
    },
    {
      icon: Zap,
      value: dashboardData?.currentStreak || 0,
      label: 'Current Streak',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: 'Personal best!'
    },
    {
      icon: Star,
      value: dashboardData?.totalPoints || 0,
      label: 'Total Points',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: '+85 today'
    }
  ];

  const quickActions = [
    {
      icon: Plus,
      label: 'Add New Habit',
      color: 'var(--color-primary)',
      action: () => router.push('/habits')
    },
    {
      icon: Trophy,
      label: 'View Achievements',
      color: 'var(--color-accent)',
      action: () => router.push('/achievements')
    },
    {
      icon: TrendingUp,
      label: 'Check Stats',
      color: 'var(--color-secondary)',
      action: () => router.push('/stats')
    },
    {
      icon: Zap,
      label: 'Join Challenge',
      color: '#f59e0b',
      action: () => router.push('/challenges')
    }
  ];

  return (
    <Layout>
      <DashboardContainer>
        <WelcomeCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-content">
            <h1>Welcome back, {user?.username}! 🎯</h1>
            <p>Ready to continue your wellness journey? Let's make today amazing!</p>
            <div className="level-info">
              <div className="level-badge">
                <Star size={16} />
                Level {user?.level || 1}
              </div>
              <div className="points">
                {dashboardData?.totalPoints || 0} Points
              </div>
              <div className="streak-info">
                🔥 {dashboardData?.currentStreak || 0} day streak
              </div>
            </div>
          </div>
        </WelcomeCard>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              $color={stat.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="icon">
                <stat.icon size={24} />
              </div>
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
              {stat.change && (
                <div className="change positive">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              )}
            </StatCard>
          ))}
        </StatsGrid>

        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Quick Actions
        </h2>
        <QuickActions>
          {quickActions.map((action, index) => (
            <ActionButton
              key={action.label}
              $color={action.color}
              onClick={action.action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="icon">
                <action.icon size={16} />
              </div>
              {action.label}
            </ActionButton>
          ))}
        </QuickActions>
      </DashboardContainer>
    </Layout>
  );
}
