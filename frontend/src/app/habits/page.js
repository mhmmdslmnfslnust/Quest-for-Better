'use client';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';

const HabitsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const AddButton = styled(motion.button)`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }
`;

const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const HabitCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .habit-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .habit-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: ${props => props.$color || 'var(--color-primary)'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .habit-actions {
      display: flex;
      gap: 8px;
    }
  }

  .habit-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .habit-description {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .habit-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .streak {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      
      .streak-number {
        font-weight: 600;
        color: var(--color-accent);
      }
    }

    .completion-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      
      &.completed {
        background: rgba(16, 185, 129, 0.2);
        color: var(--color-accent);
      }
      
      &.pending {
        background: rgba(245, 158, 11, 0.2);
        color: var(--color-warning);
      }
    }
  }
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &.complete {
    background: rgba(16, 185, 129, 0.2);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  grid-column: 1 / -1;

  .icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: var(--color-text-secondary);
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

// Mock data for demonstration
const mockHabits = [
  {
    id: 1,
    title: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindfulness',
    icon: '🧘',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    streak: 12,
    completed_today: true,
    category: 'mindfulness'
  },
  {
    id: 2,
    title: 'Daily Exercise',
    description: 'At least 30 minutes of physical activity',
    icon: '💪',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    streak: 8,
    completed_today: false,
    category: 'fitness'
  },
  {
    id: 3,
    title: 'Read for 30 Minutes',
    description: 'Expand knowledge through reading',
    icon: '📚',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    streak: 15,
    completed_today: true,
    category: 'learning'
  },
  {
    id: 4,
    title: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    icon: '💧',
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    streak: 5,
    completed_today: false,
    category: 'health'
  }
];

export default function HabitsPage() {
  const { user } = useAuth();

  const handleCompleteHabit = (habitId) => {
    console.log('Completing habit:', habitId);
    // TODO: API call to complete habit
  };

  const handleAddHabit = () => {
    console.log('Add new habit');
    // TODO: Open add habit modal
  };

  return (
    <Layout>
      <HabitsContainer>
        <Header>
          <h1>My Habits</h1>
          <AddButton
            onClick={handleAddHabit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add New Habit
          </AddButton>
        </Header>

        <HabitsGrid>
          {mockHabits.length > 0 ? (
            mockHabits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                $color={habit.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="habit-header">
                  <div className="habit-icon">{habit.icon}</div>
                  <div className="habit-actions">
                    <ActionButton
                      className={habit.completed_today ? 'complete' : ''}
                      onClick={() => handleCompleteHabit(habit.id)}
                      title={habit.completed_today ? 'Completed' : 'Mark as complete'}
                    >
                      {habit.completed_today ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </ActionButton>
                  </div>
                </div>

                <div className="habit-title">{habit.title}</div>
                <div className="habit-description">{habit.description}</div>

                <div className="habit-stats">
                  <div className="streak">
                    🔥 <span className="streak-number">{habit.streak}</span> day streak
                  </div>
                  <div className={`completion-status ${habit.completed_today ? 'completed' : 'pending'}`}>
                    {habit.completed_today ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </HabitCard>
            ))
          ) : (
            <EmptyState>
              <div className="icon">
                <Target size={32} />
              </div>
              <h2>No Habits Yet</h2>
              <p>
                Start building positive habits today! Add your first habit and begin your wellness journey.
              </p>
              <AddButton
                onClick={handleAddHabit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Add Your First Habit
              </AddButton>
            </EmptyState>
          )}
        </HabitsGrid>
      </HabitsContainer>
    </Layout>
  );
}
