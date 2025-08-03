import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, Award, Lock, Target } from 'lucide-react';
import RarityBadge from './RarityBadge';
import ProgressRing from './ProgressRing';

// Animations for earned achievements
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const earnedPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
`;

const Card = styled(motion.div)`
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* Earned Achievement Styling - Dramatic Visual Enhancement */
  ${props => props.$earned ? css`
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.15) 0%,
      rgba(34, 197, 94, 0.1) 50%,
      rgba(255, 255, 255, 0.15) 100%
    );
    border: 2px solid rgba(16, 185, 129, 0.4);
    animation: ${earnedPulse} 3s ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(16, 185, 129, 0.1), 
        transparent
      );
      animation: ${shimmer} 3s ease-in-out infinite;
    }
    
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 25px 50px rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.6);
    }
  ` : css`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    opacity: 0.65;
    filter: grayscale(0.6) brightness(0.8);
    
    &:hover {
      transform: translateY(-3px);
      opacity: 0.8;
      filter: grayscale(0.3) brightness(0.9);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
  `}
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: 16px;
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
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const PointsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  backdrop-filter: blur(10px);
`;

const EarnedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: white;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressInfo = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.3;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  
  ${props => props.$earned ? css`
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  ` : css`
    background: rgba(107, 114, 128, 0.4);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(107, 114, 128, 0.3);
  `}
`;

const ProgressMilestone = styled.div`
  ${props => props.$percentage >= 80 && !props.$earned && css`
    &::after {
      content: '🎯';
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 18px;
      z-index: 2;
    }
  `}
`;

const AchievementCard = ({ achievement, onClick }) => {
  const isEarned = achievement.is_earned;
  const progress = achievement.progress || { current: 0, target: 1 };
  const progressPercentage = Math.round((progress.current / progress.target) * 100);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = () => {
    if (isEarned) return '#10b981';
    
    switch (achievement.rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#3b82f6';
      case 'epic': return '#9333ea';
      case 'legendary': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <ProgressMilestone $percentage={progressPercentage} $earned={isEarned}>
      <Card
        $earned={isEarned}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <StatusBadge $earned={isEarned}>
          {isEarned ? (
            <>
              <Award size={14} />
              Earned
            </>
          ) : (
            <>
              <Lock size={12} />
              Locked
            </>
          )}
        </StatusBadge>
        
        <Header>
          <BadgeContainer $color={achievement.badge_color}>
            {achievement.badge_emoji}
          </BadgeContainer>
          <Content>
            <Title>{achievement.name}</Title>
            <Description>{achievement.description}</Description>
            <RarityBadge rarity={achievement.rarity} />
          </Content>
        </Header>

        <Footer>
          <PointsDisplay>
            <Award size={14} />
            {achievement.points_reward} pts
          </PointsDisplay>

          {isEarned ? (
            <EarnedInfo>
              <Calendar size={12} />
              {formatDate(achievement.earned_at)}
            </EarnedInfo>
          ) : (
            <ProgressContainer>
              <ProgressRing
                current={progress.current}
                target={progress.target}
                size={50}
                strokeWidth={4}
                color={getProgressColor()}
                showLabel={false}
              />
              <ProgressInfo>
                {progress.current} / {progress.target}
                <br />
                <span style={{ fontSize: '11px', opacity: 0.8 }}>
                  {progressPercentage}% complete
                </span>
              </ProgressInfo>
            </ProgressContainer>
          )}
        </Footer>
      </Card>
    </ProgressMilestone>
  );
};

export default AchievementCard;
