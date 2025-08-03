import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard';
import LoadingSpinner from '../LoadingSpinner';

const Container = styled.div`
  width: 100%;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: var(--color-text-secondary);
  
  .emoji {
    font-size: 64px;
    margin-bottom: 16px;
    display: block;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }
  
  p {
    font-size: 16px;
    line-height: 1.5;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const AchievementGallery = ({ 
  achievements, 
  loading, 
  onAchievementClick,
  emptyMessage = "No achievements found",
  emptyDescription = "Complete habits to unlock achievements and earn rewards!"
}) => {
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <EmptyState>
        <span className="emoji">🏆</span>
        <h3>{emptyMessage}</h3>
        <p>{emptyDescription}</p>
      </EmptyState>
    );
  }

  return (
    <Container>
      <Grid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            variants={itemVariants}
          >
            <AchievementCard
              achievement={achievement}
              onClick={() => onAchievementClick && onAchievementClick(achievement)}
            />
          </motion.div>
        ))}
      </Grid>
    </Container>
  );
};

export default AchievementGallery;
