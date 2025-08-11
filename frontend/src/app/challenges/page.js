'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, Users, Calendar, Trophy, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';

const ChallengesContainer = styled.div`
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
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const ChallengeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .challenge-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: ${props => props.$color || 'var(--color-primary)'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }

    .difficulty-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      
      &.easy {
        background: rgba(16, 185, 129, 0.2);
        color: var(--color-accent);
      }
      
      &.medium {
        background: rgba(245, 158, 11, 0.2);
        color: var(--color-warning);
      }
      
      &.hard {
        background: rgba(239, 68, 68, 0.2);
        color: var(--color-danger);
      }
    }
  }

  .challenge-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .challenge-description {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .challenge-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .stat {
      text-align: center;
      
      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-accent);
      }
      
      .stat-label {
        font-size: 12px;
        color: var(--color-text-secondary);
        margin-top: 4px;
      }
    }
  }

  .challenge-progress {
    margin-bottom: 20px;
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .progress-label {
        font-size: 14px;
        font-weight: 500;
      }
      
      .progress-percentage {
        font-size: 14px;
        color: var(--color-accent);
        font-weight: 600;
      }
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent), #059669);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }
  }
`;

const JoinButton = styled(motion.button)`
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  }

  &.joined {
    background: rgba(16, 185, 129, 0.2);
    color: var(--color-accent);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
`;

// Mock challenges data
const mockChallenges = [
  {
    id: 1,
    title: '30-Day Morning Routine',
    description: 'Start your day right with a consistent morning routine for 30 days',
    icon: '🌅',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    difficulty: 'medium',
    participants: 1247,
    duration: 30,
    reward: 500,
    progress: 15,
    joined: true
  },
  {
    id: 2,
    title: 'Fitness February',
    description: 'Complete at least 30 minutes of exercise every day this February',
    icon: '💪',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    difficulty: 'hard',
    participants: 892,
    duration: 28,
    reward: 750,
    progress: 0,
    joined: false
  },
  {
    id: 3,
    title: 'Mindfulness March',
    description: 'Practice 10 minutes of meditation daily for the entire month',
    icon: '🧘',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    difficulty: 'easy',
    participants: 2156,
    duration: 31,
    reward: 400,
    progress: 0,
    joined: false
  },
  {
    id: 4,
    title: '7-Day Hydration Challenge',
    description: 'Drink at least 8 glasses of water every day for a week',
    icon: '💧',
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    difficulty: 'easy',
    participants: 3421,
    duration: 7,
    reward: 200,
    progress: 0,
    joined: false
  },
  {
    id: 5,
    title: 'Reading Streak',
    description: 'Read for at least 30 minutes every day for 2 weeks',
    icon: '📚',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    difficulty: 'medium',
    participants: 756,
    duration: 14,
    reward: 350,
    progress: 0,
    joined: false
  },
  {
    id: 6,
    title: 'Digital Detox Weekend',
    description: 'Stay off social media for an entire weekend',
    icon: '📱',
    color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    difficulty: 'hard',
    participants: 432,
    duration: 2,
    reward: 300,
    progress: 0,
    joined: false
  }
];

export default function ChallengesPage() {
  const { user } = useAuth();

  const handleJoinChallenge = (challengeId) => {
    console.log('Joining challenge:', challengeId);
    // TODO: API call to join challenge
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'rgba(16, 185, 129, 0.2)';
      case 'medium': return 'rgba(245, 158, 11, 0.2)';
      case 'hard': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <Layout>
      <ChallengesContainer>
        <Header>
          <h1>Community Challenges</h1>
          <p className="subtitle">
            Join community challenges to stay motivated, compete with others, and earn bonus rewards
          </p>
        </Header>

        <ChallengesGrid>
          {mockChallenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              $color={challenge.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="challenge-header">
                <div className="challenge-icon">{challenge.icon}</div>
                <div className={`difficulty-badge ${challenge.difficulty}`}>
                  {challenge.difficulty}
                </div>
              </div>

              <div className="challenge-title">{challenge.title}</div>
              <div className="challenge-description">{challenge.description}</div>

              <div className="challenge-stats">
                <div className="stat">
                  <div className="stat-value">
                    <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    {challenge.participants.toLocaleString()}
                  </div>
                  <div className="stat-label">Participants</div>
                </div>
                <div className="stat">
                  <div className="stat-value">
                    <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    {challenge.duration}
                  </div>
                  <div className="stat-label">Days</div>
                </div>
                <div className="stat">
                  <div className="stat-value">
                    <Trophy size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    {challenge.reward}
                  </div>
                  <div className="stat-label">Points</div>
                </div>
              </div>

              {challenge.joined && (
                <div className="challenge-progress">
                  <div className="progress-header">
                    <div className="progress-label">Progress</div>
                    <div className="progress-percentage">
                      {Math.round((challenge.progress / challenge.duration) * 100)}%
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(challenge.progress / challenge.duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <JoinButton
                className={challenge.joined ? 'joined' : ''}
                onClick={() => handleJoinChallenge(challenge.id)}
                whileHover={{ scale: challenge.joined ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={challenge.joined}
              >
                {challenge.joined ? (
                  <>
                    <Target size={16} />
                    In Progress
                  </>
                ) : (
                  <>
                    Join Challenge
                    <ArrowRight size={16} />
                  </>
                )}
              </JoinButton>
            </ChallengeCard>
          ))}
        </ChallengesGrid>
      </ChallengesContainer>
    </Layout>
  );
}
