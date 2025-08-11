'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Target, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 16px;
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
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .label {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .change {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.positive { color: var(--color-accent); }
    &.negative { color: var(--color-danger); }
  }
`;

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-size: 20px;
      font-weight: 600;
    }

    .time-selector {
      display: flex;
      gap: 8px;

      button {
        padding: 6px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text-secondary);
        border-radius: 6px;
        font-size: 12px;
        transition: all 0.2s ease;

        &:hover, &.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
      }
    }
  }

  .chart-placeholder {
    height: 300px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
`;

const InsightCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;

  .insight-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .insight-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-accent) 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .insight-content {
    color: var(--color-text-secondary);
    line-height: 1.6;

    .highlight {
      color: var(--color-accent);
      font-weight: 600;
    }
  }
`;

export default function StatsPage() {
  const { user } = useAuth();

  const stats = [
    {
      icon: Target,
      value: '18',
      label: 'Total Habits',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: '+3 this month',
      positive: true
    },
    {
      icon: Zap,
      value: '27',
      label: 'Longest Streak',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      change: 'Personal record!',
      positive: true
    },
    {
      icon: Calendar,
      value: '85%',
      label: 'Weekly Success Rate',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: '+12% from last week',
      positive: true
    },
    {
      icon: Trophy,
      value: '2,847',
      label: 'Total Points',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: '+245 this week',
      positive: true
    }
  ];

  return (
    <Layout>
      <StatsContainer>
        <Header>
          <h1>Your Statistics</h1>
          <p className="subtitle">
            Analyze your progress and discover insights about your wellness journey
          </p>
        </Header>

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
              <div className={`change ${stat.positive ? 'positive' : 'negative'}`}>
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </StatCard>
          ))}
        </StatsGrid>

        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="chart-header">
            <h2>Habit Completion Trends</h2>
            <div className="time-selector">
              <button className="active">7D</button>
              <button>30D</button>
              <button>90D</button>
              <button>1Y</button>
            </div>
          </div>
          <div className="chart-placeholder">
            📊 Chart visualization would be displayed here
            <br />
            <small>(Chart.js or Recharts integration)</small>
          </div>
        </ChartContainer>

        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="insight-header">
            <div className="insight-icon">
              <BarChart3 size={20} />
            </div>
            <h3>Weekly Insights</h3>
          </div>
          <div className="insight-content">
            Great job this week! You've maintained a <span className="highlight">85% completion rate</span> across all your habits. 
            Your morning routine has been particularly strong with a <span className="highlight">12-day streak</span>. 
            Consider focusing on your evening habits next week to boost your overall consistency.
          </div>
        </InsightCard>

        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="insight-header">
            <div className="insight-icon">
              <Target size={20} />
            </div>
            <h3>Habit Performance</h3>
          </div>
          <div className="insight-content">
            Your <span className="highlight">fitness habits</span> show the most consistency, while 
            <span className="highlight"> productivity habits</span> could use some attention. 
            Try linking new habits to existing strong ones for better success rates.
          </div>
        </InsightCard>
      </StatsContainer>
    </Layout>
  );
}
