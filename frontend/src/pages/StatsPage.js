import React from 'react';
import styled from 'styled-components';
import { BarChart3 } from 'lucide-react';

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

const StatsPage = () => {
  return (
    <PageContainer>
      <Title>
        <BarChart3 size={32} />
        Statistics
      </Title>

      <ComingSoon>
        <div className="icon">📊</div>
        <h2>Advanced Analytics Coming Soon!</h2>
        <p>
          Dive deep into your habit data with comprehensive charts, trends, 
          and insights. Track your progress over time, identify patterns, 
          and get personalized recommendations to optimize your wellness journey.
        </p>
      </ComingSoon>
    </PageContainer>
  );
};

export default StatsPage;
