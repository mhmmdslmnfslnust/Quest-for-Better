import React from 'react';
import styled from 'styled-components';
import { Target, Plus } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AddButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
  }
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

const HabitsPage = () => {
  return (
    <PageContainer>
      <Header>
        <Title>
          <Target size={32} />
          My Habits
        </Title>
        <AddButton>
          <Plus size={20} />
          Add Habit
        </AddButton>
      </Header>

      <ComingSoon>
        <div className="icon">🎯</div>
        <h2>Habit Management Coming Soon!</h2>
        <p>
          This page will feature comprehensive habit management including creating, 
          editing, tracking, and analyzing your daily habits. You'll be able to 
          set difficulty levels, choose categories, and track your progress with 
          beautiful visualizations.
        </p>
      </ComingSoon>
    </PageContainer>
  );
};

export default HabitsPage;
