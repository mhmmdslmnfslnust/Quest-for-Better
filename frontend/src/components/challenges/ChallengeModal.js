import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Target, 
  Clock, 
  Calendar, 
  Users, 
  Zap, 
  Award,
  TrendingUp,
  Play
} from 'lucide-react';
import Leaderboard from './Leaderboard';
import { useChallenges } from '../../hooks/useChallenges';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  padding: 32px 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-text-primary);
    transform: scale(1.1);
  }
`;

const BadgeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

const Badge = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.$color || '#6366f1'}20;
  border: 3px solid ${props => props.$color || '#6366f1'}40;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
`;

const StatusSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return 'rgba(34, 197, 94, 0.2)';
      case 'active': return 'rgba(59, 130, 246, 0.2)';
      case 'expired': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#22c55e';
      case 'active': return '#3b82f6';
      case 'expired': return '#ef4444';
      default: return '#9ca3af';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'completed': return 'rgba(34, 197, 94, 0.3)';
      case 'active': return 'rgba(59, 130, 246, 0.3)';
      case 'expired': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(156, 163, 175, 0.3)';
    }
  }};
`;

const Content = styled.div`
  padding: 24px 32px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button`
  padding: 12px 20px;
  border: none;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
    : 'transparent'
  };
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--color-text-secondary)'
  };
  border-radius: 12px 12px 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'rgba(255, 255, 255, 0.05)'
    };
    color: ${props => props.$active 
      ? 'white' 
      : 'var(--color-text-primary)'
    };
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const MetricIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color || '#6366f1'}20;
  margin: 0 auto 12px;
  color: ${props => props.$color || '#6366f1'};
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ProgressTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const ProgressValue = styled.div`
  font-size: 16px;
  color: var(--color-text-secondary);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.$status === 'completed') return 'linear-gradient(90deg, #22c55e, #16a34a)';
    if (props.$status === 'active') return 'linear-gradient(90deg, #3b82f6, #1d4ed8)';
    return 'linear-gradient(90deg, #6b7280, #4b5563)';
  }};
  width: ${props => Math.min(100, Math.max(0, props.$progress || 0))}%;
  transition: width 0.3s ease;
  border-radius: 6px;
`;

const ProgressPercentage = styled.div`
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    switch (props.$variant) {
      case 'join':
        return `
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }
        `;
      case 'update':
        return `
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
          }
        `;
      case 'secondary':
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChallengeModal = ({ 
  challenge, 
  isOpen, 
  onClose, 
  onJoin, 
  onUpdateProgress,
  isUserChallenge = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboard, setLeaderboard] = useState([]);
  const [challengeStats, setChallengeStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { getLeaderboard, getChallengeStats } = useChallenges();

  useEffect(() => {
    if (isOpen && challenge?.id && activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [isOpen, challenge?.id, activeTab]);

  useEffect(() => {
    if (isOpen && challenge?.id) {
      loadChallengeStats();
    }
  }, [isOpen, challenge?.id]);

  const loadLeaderboard = async () => {
    if (!challenge?.id) return;
    
    setLoading(true);
    const result = await getLeaderboard(challenge.id, 20);
    if (result.success) {
      setLeaderboard(result.data);
    }
    setLoading(false);
  };

  const loadChallengeStats = async () => {
    if (!challenge?.id) return;
    
    const result = await getChallengeStats(challenge.id);
    if (result.success) {
      setChallengeStats(result.data);
    }
  };

  const handleJoin = async () => {
    if (onJoin) {
      setLoading(true);
      await onJoin(challenge.id);
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (onUpdateProgress) {
      setLoading(true);
      await onUpdateProgress(challenge.id);
      setLoading(false);
    }
  };

  const formatDuration = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days === 7) return '1 week';
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'active': return '#3b82f6';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!challenge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
              
              <BadgeSection>
                <Badge $color={getStatusColor(challenge.status)}>
                  {challenge.badge_emoji || '🏆'}
                </Badge>
                
                <TitleSection>
                  <Title>{challenge.name}</Title>
                  <Subtitle>{challenge.description}</Subtitle>
                  
                  <StatusSection>
                    <StatusBadge $status={challenge.status}>
                      {challenge.status === 'completed' && <Trophy size={14} />}
                      {challenge.status === 'active' && <Zap size={14} />}
                      {challenge.status === 'expired' && <Clock size={14} />}
                      {challenge.status || 'Available'}
                    </StatusBadge>
                    
                    {isUserChallenge && challenge.status === 'active' && (
                      <StatusBadge $status="active">
                        <Clock size={14} />
                        {challenge.days_remaining || 0} days left
                      </StatusBadge>
                    )}
                  </StatusSection>
                </TitleSection>
              </BadgeSection>
            </Header>

            <Content>
              <TabButtons>
                <TabButton 
                  $active={activeTab === 'overview'} 
                  onClick={() => setActiveTab('overview')}
                >
                  <Target size={16} />
                  Overview
                </TabButton>
                <TabButton 
                  $active={activeTab === 'leaderboard'} 
                  onClick={() => setActiveTab('leaderboard')}
                >
                  <Trophy size={16} />
                  Leaderboard
                </TabButton>
              </TabButtons>

              {activeTab === 'overview' && (
                <>
                  <MetricsGrid>
                    <MetricCard>
                      <MetricIcon $color="#3b82f6">
                        <Target />
                      </MetricIcon>
                      <MetricValue>{challenge.target_value}</MetricValue>
                      <MetricLabel>{challenge.challenge_type.replace('_', ' ')}</MetricLabel>
                    </MetricCard>
                    
                    <MetricCard>
                      <MetricIcon $color="#059669">
                        <Calendar />
                      </MetricIcon>
                      <MetricValue>{formatDuration(challenge.duration_days)}</MetricValue>
                      <MetricLabel>Duration</MetricLabel>
                    </MetricCard>
                    
                    <MetricCard>
                      <MetricIcon $color="#dc2626">
                        <Award />
                      </MetricIcon>
                      <MetricValue>{challenge.reward_points}</MetricValue>
                      <MetricLabel>Reward Points</MetricLabel>
                    </MetricCard>
                    
                    <MetricCard>
                      <MetricIcon $color="#7c3aed">
                        <Users />
                      </MetricIcon>
                      <MetricValue>{challengeStats.total_participants || 0}</MetricValue>
                      <MetricLabel>Participants</MetricLabel>
                    </MetricCard>
                  </MetricsGrid>

                  {isUserChallenge && (
                    <ProgressSection>
                      <ProgressHeader>
                        <ProgressTitle>Your Progress</ProgressTitle>
                        <ProgressValue>
                          {challenge.current_progress || 0} / {challenge.target_value}
                        </ProgressValue>
                      </ProgressHeader>
                      
                      <ProgressBar>
                        <ProgressFill 
                          $progress={challenge.progress_percentage || 0}
                          $status={challenge.status}
                        />
                      </ProgressBar>
                      
                      <ProgressPercentage>
                        {Math.round(challenge.progress_percentage || 0)}% complete
                      </ProgressPercentage>
                    </ProgressSection>
                  )}
                </>
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard
                  challengeId={challenge.id}
                  challengeName={challenge.name}
                  leaderboardData={leaderboard}
                  stats={challengeStats}
                  loading={loading}
                />
              )}
            </Content>

            <ActionButtons>
              {isUserChallenge ? (
                challenge.status === 'active' ? (
                  <ActionButton 
                    $variant="update" 
                    onClick={handleUpdateProgress}
                    disabled={loading}
                  >
                    <Zap size={16} />
                    Update Progress
                  </ActionButton>
                ) : (
                  <ActionButton $variant="secondary" onClick={onClose}>
                    Close
                  </ActionButton>
                )
              ) : (
                <>
                  <ActionButton $variant="secondary" onClick={onClose}>
                    Cancel
                  </ActionButton>
                  <ActionButton 
                    $variant="join" 
                    onClick={handleJoin}
                    disabled={loading}
                  >
                    <Play size={16} />
                    Join Challenge
                  </ActionButton>
                </>
              )}
            </ActionButtons>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
