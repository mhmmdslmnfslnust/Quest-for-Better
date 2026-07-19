'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { habitsAPI } from '../../services/api';

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

const Modal = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: var(--color-surface);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  input, textarea, select {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-primary);
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: rgba(255, 255, 255, 0.08);
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  border: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-secondary);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function HabitsPage() {
  const { user, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health',
    type: 'build',
    difficulty: 3,
    target_frequency: 7,
    icon: '🎯'
  });

  // Fetch habits from API
  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits();
    }
  }, [isAuthenticated]);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await habitsAPI.getAll();
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits');
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitsAPI.logCompletion(habitId, {
        date: new Date().toISOString().split('T')[0],
        success: true,
        notes: ''
      });
      // Refresh habits to show updated completion status
      fetchHabits();
    } catch (err) {
      console.error('Error completing habit:', err);
      alert('Failed to complete habit. Please try again.');
    }
  };

  const handleAddHabit = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewHabit({
      name: '',
      description: '',
      category: 'health',
      type: 'build',
      difficulty: 3,
      target_frequency: 7,
      icon: '🎯'
    });
  };

  const handleSubmitHabit = async (e) => {
    e.preventDefault();
    
    if (!newHabit.name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    try {
      setIsSubmitting(true);
      await habitsAPI.create(newHabit);
      await fetchHabits(); // Refresh the list
      handleCloseModal();
      alert('Habit created successfully!');
    } catch (err) {
      console.error('Error creating habit:', err);
      alert('Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your habits..." />;
  }

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

        {error && (
          <div style={{ 
            color: 'var(--color-danger)', 
            padding: '16px', 
            marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px'
          }}>
            {error}
          </div>
        )}

        <HabitsGrid>
          {habits.length > 0 ? (
            habits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                $color={habit.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="habit-header">
                  <div className="habit-icon">{habit.icon || '🎯'}</div>
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

                <div className="habit-title">{habit.name || habit.title}</div>
                <div className="habit-description">{habit.description}</div>

                <div className="habit-stats">
                  <div className="streak">
                    🔥 <span className="streak-number">{habit.current_streak || 0}</span> day streak
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

      {/* Add Habit Modal */}
      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleCloseModal}>
              <X size={16} />
            </CloseButton>

            <h2>Add New Habit</h2>

            <form onSubmit={handleSubmitHabit}>
              <FormGroup>
                <label htmlFor="name">Habit Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newHabit.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Morning Exercise"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newHabit.description}
                  onChange={handleInputChange}
                  placeholder="What does this habit involve?"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newHabit.category}
                  onChange={handleInputChange}
                >
                  <option value="health">🏃 Health</option>
                  <option value="mindfulness">🧘 Mindfulness</option>
                  <option value="productivity">⚡ Productivity</option>
                  <option value="learning">📚 Learning</option>
                  <option value="social">👥 Social</option>
                  <option value="fitness">💪 Fitness</option>
                  <option value="nutrition">🥗 Nutrition</option>
                  <option value="creativity">🎨 Creativity</option>
                  <option value="other">📌 Other</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={newHabit.type}
                  onChange={handleInputChange}
                >
                  <option value="build">Build (Create new habit)</option>
                  <option value="break">Break (Stop bad habit)</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={newHabit.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="1">1 - Very Easy</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - Hard</option>
                  <option value="5">5 - Very Hard</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="target_frequency">Target Frequency (days/week)</label>
                <select
                  id="target_frequency"
                  name="target_frequency"
                  value={newHabit.target_frequency}
                  onChange={handleInputChange}
                >
                  <option value="1">1 day/week</option>
                  <option value="2">2 days/week</option>
                  <option value="3">3 days/week</option>
                  <option value="4">4 days/week</option>
                  <option value="5">5 days/week</option>
                  <option value="6">6 days/week</option>
                  <option value="7">7 days/week (Daily)</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="icon">Icon (Emoji)</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={newHabit.icon}
                  onChange={handleInputChange}
                  placeholder="🎯"
                  maxLength={2}
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Habit'}
                </SubmitButton>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Layout>
  );
}
