import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';

const celebrationAnimation = keyframes`
  0% { transform: scale(0.8) rotate(-5deg); }
  50% { transform: scale(1.1) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const sparkleAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
  25% { transform: translateY(-10px) rotate(90deg); opacity: 0.7; }
  50% { transform: translateY(-5px) rotate(180deg); opacity: 1; }
  75% { transform: translateY(-15px) rotate(270deg); opacity: 0.7; }
`;

const Container = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 16px;
  color: white;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  min-width: 300px;
  animation: ${celebrationAnimation} 0.6s ease-out;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AchievementName = styled.div`
  font-size: 14px;
  opacity: 0.9;
  font-weight: 600;
`;

const Points = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Sparkle = styled(Sparkles)`
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  animation: ${sparkleAnimation} 2s infinite;
  
  &:nth-child(1) {
    top: 10px;
    right: 10px;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20px;
    left: 10px;
    animation-delay: 0.5s;
  }
  
  &:nth-child(3) {
    bottom: 15px;
    right: 20px;
    animation-delay: 1s;
  }
`;

const BadgeEmoji = styled.span`
  font-size: 18px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const AchievementToast = ({ achievement }) => {
  return (
    <Container
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
    >
      <Sparkle size={12} />
      <Sparkle size={10} />
      <Sparkle size={14} />
      
      <Header>
        <IconContainer>
          <Award size={20} />
        </IconContainer>
        <Content>
          <Title>
            🎉 Achievement Unlocked!
            <BadgeEmoji>{achievement.badge_emoji}</BadgeEmoji>
          </Title>
          <AchievementName>{achievement.name}</AchievementName>
          <Points>
            <Award size={12} />
            +{achievement.points_reward} points earned
          </Points>
        </Content>
      </Header>
    </Container>
  );
};

export default AchievementToast;
