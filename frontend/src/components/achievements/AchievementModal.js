import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Calendar, Target } from 'lucide-react';
import RarityBadge from './RarityBadge';
import ProgressRing from './ProgressRing';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-text-primary);
    transform: scale(1.05);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.$color || '#6366f1'}20;
  border: 3px solid ${props => props.$color || '#6366f1'}40;
  font-size: 40px;
  margin: 0 auto 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const RarityContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const StatIcon = styled.div`
  color: ${props => props.$color || 'var(--color-text-secondary)'};
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const ProgressTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
`;

const ProgressDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
`;

const ProgressText = styled.div`
  text-align: left;
  
  .current {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
  }
  
  .target {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }
  
  .percentage {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 2px;
  }
`;

const EarnedBadge = styled.div`
  background: linear-gradient(135deg, #10b981, #065f46);
  color: white;
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
`;

const AchievementModal = ({ achievement, isOpen, onClose }) => {
  if (!achievement) return null;

  const isEarned = achievement.is_earned;
  const progress = achievement.progress || { current: 0, target: 1 };
  const percentage = Math.round((progress.current / progress.target) * 100);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>

            <Header>
              <BadgeContainer $color={achievement.badge_color}>
                {achievement.badge_emoji}
              </BadgeContainer>
              <Title>{achievement.name}</Title>
              <Description>{achievement.description}</Description>
              <RarityContainer>
                <RarityBadge rarity={achievement.rarity} />
              </RarityContainer>
            </Header>

            {isEarned && (
              <EarnedBadge>
                <Award size={20} />
                Achievement Unlocked!
              </EarnedBadge>
            )}

            <Stats>
              <StatCard>
                <StatIcon $color="#f59e0b">
                  <Award size={20} />
                </StatIcon>
                <StatValue>{achievement.points_reward}</StatValue>
                <StatLabel>Points Reward</StatLabel>
              </StatCard>

              {isEarned && (
                <StatCard>
                  <StatIcon $color="#10b981">
                    <Calendar size={20} />
                  </StatIcon>
                  <StatValue>{formatDate(achievement.earned_at).split(',')[0]}</StatValue>
                  <StatLabel>Date Earned</StatLabel>
                </StatCard>
              )}

              <StatCard>
                <StatIcon $color="#6366f1">
                  <Target size={20} />
                </StatIcon>
                <StatValue>{achievement.category}</StatValue>
                <StatLabel>Category</StatLabel>
              </StatCard>
            </Stats>

            {!isEarned && (
              <ProgressSection>
                <ProgressTitle>Progress to Unlock</ProgressTitle>
                <ProgressDetails>
                  <ProgressRing
                    current={progress.current}
                    target={progress.target}
                    size={80}
                    strokeWidth={6}
                    color={getProgressColor()}
                    showLabel={false}
                  />
                  <ProgressText>
                    <div className="current">{progress.current}</div>
                    <div className="target">of {progress.target} needed</div>
                    <div className="percentage">{percentage}% complete</div>
                  </ProgressText>
                </ProgressDetails>
              </ProgressSection>
            )}
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;
