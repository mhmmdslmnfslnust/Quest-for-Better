import React from 'react';
import styled from 'styled-components';
import { Trophy } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const ComingSoon = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 64px;
  text-align: center;
  color: var(--color-text-primary);

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    opacity: 0.8;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .icon {
    font-size: 64px;
    margin-bottom: 24px;
  }
`;

const AchievementsPage = () => {
  return (
    <PageContainer>
      <Title>
        <Trophy size={32} />
        Achievements
      </Title>

      <ComingSoon>
        <div className="icon">🏆</div>
        <h2>Achievement System Coming Soon!</h2>
        <p>
          Unlock badges, collect rewards, and track your wellness milestones. 
          The achievement system will feature multiple categories including 
          streak achievements, point milestones, and special secret badges 
          for dedicated habit builders.
        </p>
      </ComingSoon>
    </PageContainer>
  );
};

export default AchievementsPage;
