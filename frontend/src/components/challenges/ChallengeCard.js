import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Target, Users, Trophy, Calendar, Zap } from 'lucide-react';

// Animations for active challenges
const progressPulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
`;

const completedGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
`;

const Card = styled(motion.div)`
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* Status-based styling */
  ${props => {
    switch (props.$status) {
      case 'completed':
        return css`
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.15) 0%,
            rgba(16, 185, 129, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 2px solid rgba(34, 197, 94, 0.4);
          animation: ${completedGlow} 3s ease-in-out infinite;
          
          &:hover {
            transform: translateY(-6px);
            box-shadow: 0 25px 50px rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.6);
          }
        `;
      case 'active':
        return css`
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.12) 0%,
            rgba(99, 102, 241, 0.1) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          border: 2px solid rgba(59, 130, 246, 0.3);
          animation: ${progressPulse} 2s ease-in-out infinite;
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
            border-color: rgba(59, 130, 246, 0.5);
          }
        `;
      case 'expired':
        return css`
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.7;
          filter: grayscale(0.3);
          
          &:hover {
            transform: translateY(-2px);
            opacity: 0.8;
            background: rgba(255, 255, 255, 0.08);
          }
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border-color: rgba(255, 255, 255, 0.3);
          }
        `;
    }
  }}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${props => props.$color || '#6366f1'}20;
  border: 2px solid ${props => props.$color || '#6366f1'}40;
  font-size: 28px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Content = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return css`
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'active':
        return css`
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
      case 'expired':
        return css`
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      default:
        return css`
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `;
    }
  }}
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  
  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
`;

const ProgressSection = styled.div`
  margin-top: 16px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
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
  border-radius: 4px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
  
  ${props => {
    switch (props.$variant) {
      case 'join':
        return css`
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `;
      case 'update':
        return css`
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
          }
        `;
      case 'view':
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
`;

const ChallengeCard = ({ 
  challenge, 
  onJoin, 
  onUpdateProgress, 
  onViewDetails,
  isUserChallenge = false,
  loading = false
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'active': return '#3b82f6';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getActionButton = () => {
    if (isUserChallenge) {
      if (challenge.status === 'active') {
        return (
          <ActionButton 
            $variant="update" 
            onClick={() => onUpdateProgress?.(challenge.id)}
            disabled={loading}
          >
            <Zap size={16} style={{ marginRight: '8px', display: 'inline' }} />
            Update Progress
          </ActionButton>
        );
      } else {
        return (
          <ActionButton 
            $variant="view" 
            onClick={() => onViewDetails?.(challenge)}
          >
            View Details
          </ActionButton>
        );
      }
    } else {
      return (
        <ActionButton 
          $variant="join" 
          onClick={() => onJoin?.(challenge.id)}
          disabled={loading}
        >
          <Trophy size={16} style={{ marginRight: '8px', display: 'inline' }} />
          Join Challenge
        </ActionButton>
      );
    }
  };

  const formatDuration = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days === 7) return '1 week';
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  return (
    <Card
      $status={challenge.status}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onViewDetails?.(challenge)}
    >
      <Header>
        <BadgeContainer $color={getStatusColor(challenge.status)}>
          {challenge.badge_emoji || '🏆'}
        </BadgeContainer>
        <StatusBadge $status={challenge.status}>
          {challenge.status === 'completed' && <Trophy size={12} />}
          {challenge.status === 'active' && <Zap size={12} />}
          {challenge.status === 'expired' && <Clock size={12} />}
          {challenge.status || 'Available'}
        </StatusBadge>
      </Header>
      
      <Content>
        <Title>{challenge.name}</Title>
        <Description>{challenge.description}</Description>
        
        <MetricsGrid>
          <Metric>
            <Calendar />
            {formatDuration(challenge.duration_days)}
          </Metric>
          <Metric>
            <Target />
            {challenge.target_value} {challenge.challenge_type.replace('_', ' ')}
          </Metric>
          <Metric>
            <Trophy />
            {challenge.reward_points} points
          </Metric>
          {isUserChallenge && challenge.status === 'active' && (
            <Metric>
              <Clock />
              {challenge.days_remaining || 0} days left
            </Metric>
          )}
        </MetricsGrid>
        
        {isUserChallenge && (
          <ProgressSection>
            <ProgressLabel>
              <span>Progress</span>
              <span>{challenge.current_progress || 0} / {challenge.target_value}</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill 
                $progress={challenge.progress_percentage || 0}
                $status={challenge.status}
              />
            </ProgressBar>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: 'var(--color-text-secondary)', 
              marginTop: '4px' 
            }}>
              {Math.round(challenge.progress_percentage || 0)}% complete
            </div>
          </ProgressSection>
        )}
        
        {getActionButton()}
      </Content>
    </Card>
  );
};

export default ChallengeCard;
