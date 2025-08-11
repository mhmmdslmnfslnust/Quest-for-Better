'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target, Zap } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';

const AchievementsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 16px;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-top: 24px;
    flex-wrap: wrap;

    .stat {
      text-align: center;
      
      .number {
        font-size: 24px;
        font-weight: 700;
        color: var(--color-accent);
      }
      
      .label {
        font-size: 14px;
        color: var(--color-text-secondary);
        margin-top: 4px;
      }
    }
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const AchievementCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  ${props => props.$unlocked ? `
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.05);
  ` : `
    opacity: 0.6;
  `}

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.$unlocked ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .achievement-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${props => props.$unlocked ? 
      'linear-gradient(135deg, var(--color-accent) 0%, #059669 100%)' : 
      'rgba(255, 255, 255, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: ${props => props.$unlocked ? 'white' : 'var(--color-text-secondary)'};
    font-size: 24px;
    position: relative;

    ${props => props.$unlocked && `
      &::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-accent), #059669, var(--color-primary));
        z-index: -1;
        animation: glow 2s ease-in-out infinite alternate;
      }
    `}
  }

  .achievement-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.$unlocked ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};
  }

  .achievement-description {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .achievement-progress {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--color-text-secondary);

    ${props => props.$unlocked && `
      color: var(--color-accent);
      background: rgba(16, 185, 129, 0.1);
      font-weight: 600;
    `}
  }

  .rarity-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    
    &.common {
      background: rgba(156, 163, 175, 0.2);
      color: #9ca3af;
    }
    
    &.rare {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }
    
    &.epic {
      background: rgba(139, 92, 246, 0.2);
      color: #8b5cf6;
    }
    
    &.legendary {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }
  }

  @keyframes glow {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
`;

// Mock achievements data
const mockAchievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first habit',
    icon: '🎯',
    unlocked: true,
    progress: 'Completed',
    rarity: 'common',
    unlockedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: true,
    progress: 'Completed',
    rarity: 'rare',
    unlockedAt: '2024-01-22'
  },
  {
    id: 3,
    title: 'Habit Master',
    description: 'Create 10 different habits',
    icon: '👑',
    unlocked: false,
    progress: '4/10 habits created',
    rarity: 'epic'
  },
  {
    id: 4,
    title: 'Consistency King',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    unlocked: false,
    progress: '12/30 days',
    rarity: 'legendary'
  },
  {
    id: 5,
    title: 'Early Bird',
    description: 'Complete morning routine 10 times',
    icon: '🌅',
    unlocked: true,
    progress: 'Completed',
    rarity: 'common',
    unlockedAt: '2024-02-01'
  },
  {
    id: 6,
    title: 'Social Butterfly',
    description: 'Complete 5 community challenges',
    icon: '🦋',
    unlocked: false,
    progress: '2/5 challenges',
    rarity: 'rare'
  }
];

export default function AchievementsPage() {
  const { user } = useAuth();
  
  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalCount = mockAchievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <Layout>
      <AchievementsContainer>
        <Header>
          <h1>Your Achievements</h1>
          <p className="subtitle">
            Track your progress and celebrate your wellness milestones
          </p>
          <div className="stats">
            <div className="stat">
              <div className="number">{unlockedCount}</div>
              <div className="label">Unlocked</div>
            </div>
            <div className="stat">
              <div className="number">{totalCount}</div>
              <div className="label">Total</div>
            </div>
            <div className="stat">
              <div className="number">{completionPercentage}%</div>
              <div className="label">Complete</div>
            </div>
          </div>
        </Header>

        <AchievementsGrid>
          {mockAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              $unlocked={achievement.unlocked}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`rarity-badge ${achievement.rarity}`}>
                {achievement.rarity}
              </div>
              
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              
              <div className="achievement-title">
                {achievement.title}
              </div>
              
              <div className="achievement-description">
                {achievement.description}
              </div>
              
              <div className="achievement-progress">
                {achievement.unlocked 
                  ? `🎉 ${achievement.progress}` 
                  : achievement.progress
                }
              </div>
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </AchievementsContainer>
    </Layout>
  );
}
