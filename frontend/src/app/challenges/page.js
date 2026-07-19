'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, Users, Calendar, Trophy, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { challengesAPI } from '../../services/api';

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

  ${props => props.$joined && `
    background: rgba(16, 185, 129, 0.08);
    border: 2px solid rgba(16, 185, 129, 0.3);
    box-shadow: 0 4px 24px rgba(16, 185, 129, 0.15);
    
    &::before {
      content: '✓ JOINED';
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 10px;
      font-weight: 700;
      color: var(--color-accent);
      background: rgba(16, 185, 129, 0.2);
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
  `}

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.$joined ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
    box-shadow: ${props => props.$joined ? 
      '0 8px 32px rgba(16, 185, 129, 0.2)' : 
      '0 8px 32px rgba(0, 0, 0, 0.1)'};
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

export default function ChallengesPage() {
  const { user, isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchChallenges();
    }
  }, [isAuthenticated]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [allChallenges, joinedChallenges] = await Promise.all([
        challengesAPI.getAll(),
        challengesAPI.getUserChallenges()
      ]);
      
      // Merge challenges with user progress
      const mergedChallenges = (Array.isArray(allChallenges) ? allChallenges : []).map(challenge => {
        const userChallenge = (Array.isArray(joinedChallenges) ? joinedChallenges : []).find(
          uc => uc.challenge_id === challenge.id
        );
        return {
          ...challenge,
          joined: !!userChallenge,
          progress: userChallenge?.current_progress || 0
        };
      });
      
      // Sort: Joined challenges first, then by difficulty (hard first), then by participants
      const sortedChallenges = mergedChallenges.sort((a, b) => {
        // Priority 1: Joined challenges first
        if (a.joined && !b.joined) return -1;
        if (!a.joined && b.joined) return 1;
        
        // Priority 2: Difficulty (hard > medium > easy)
        const difficultyOrder = { hard: 3, medium: 2, easy: 1 };
        const diffA = difficultyOrder[a.difficulty] || 2;
        const diffB = difficultyOrder[b.difficulty] || 2;
        if (diffA !== diffB) return diffB - diffA;
        
        // Priority 3: Participant count (more popular first)
        return (b.participant_count || 0) - (a.participant_count || 0);
      });
      
      setChallenges(sortedChallenges);
      setUserChallenges(Array.isArray(joinedChallenges) ? joinedChallenges : []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges');
      setChallenges([]);
      setUserChallenges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await challengesAPI.join(challengeId);
      alert('Successfully joined challenge! 🎉');
      // Refresh challenges to show updated join status
      fetchChallenges();
    } catch (err) {
      console.error('Error joining challenge:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to join challenge';
      if (errorMsg.includes('Already joined')) {
        alert('You have already joined this challenge!');
      } else {
        alert(`Failed to join challenge: ${errorMsg}`);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'rgba(16, 185, 129, 0.2)';
      case 'medium': return 'rgba(245, 158, 11, 0.2)';
      case 'hard': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading challenges..." />;
  }

  return (
    <Layout>
      <ChallengesContainer>
        <Header>
          <h1>Community Challenges</h1>
          <p className="subtitle">
            Join community challenges to stay motivated, compete with others, and earn bonus rewards
          </p>
        </Header>

        {error && (
          <div style={{ 
            color: 'var(--color-danger)', 
            padding: '16px', 
            marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <ChallengesGrid>
          {challenges.length > 0 ? (
            challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                $joined={challenge.joined}
                $color={challenge.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="challenge-header">
                  <div className="challenge-icon">{challenge.badge_emoji || '🎯'}</div>
                  <div className={`difficulty-badge ${challenge.difficulty || 'medium'}`}>
                    {challenge.difficulty || 'medium'}
                  </div>
                </div>

                <div className="challenge-title">{challenge.name}</div>
                <div className="challenge-description">{challenge.description}</div>

                <div className="challenge-stats">
                  <div className="stat">
                    <div className="stat-value">
                      <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      {challenge.participant_count || 0}
                    </div>
                    <div className="stat-label">Participants</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">
                      <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      {challenge.duration_days}
                    </div>
                    <div className="stat-label">Days</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">
                      <Trophy size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      {challenge.reward_points}
                    </div>
                    <div className="stat-label">Points</div>
                  </div>
                </div>

                {challenge.joined && (
                  <div className="challenge-progress">
                    <div className="progress-header">
                      <div className="progress-label">Your Progress</div>
                      <div className="progress-percentage">
                        {Math.round((challenge.progress / challenge.target_value) * 100)}%
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((challenge.progress / challenge.target_value) * 100, 100)}%` }}
                      />
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'var(--color-text-secondary)', 
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      {challenge.progress} / {challenge.target_value}
                    </div>
                  </div>
                )}

                <JoinButton
                  className={challenge.joined ? 'joined' : ''}
                  onClick={() => !challenge.joined && handleJoinChallenge(challenge.id)}
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
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '60px 20px',
              color: 'var(--color-text-secondary)'
            }}>
              <Zap size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No challenges available yet. Check back soon for exciting new challenges!</p>
            </div>
          )}
        </ChallengesGrid>
      </ChallengesContainer>
    </Layout>
  );
}
