import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Target, Plus, AlertCircle, Loader } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/habits/HabitCard';
import HabitTrackingButton from '../components/habits/HabitTrackingButton';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import HabitFilters from '../components/habits/HabitFilters';
import LoadingSpinner from '../components/LoadingSpinner';

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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const HabitsGrid = styled.div`
  display: ${props => props.$view === 'grid' ? 'grid' : 'flex'};
  ${props => props.$view === 'grid' ? `
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  ` : `
    flex-direction: column;
    gap: 16px;
  `}
`;

const EmptyState = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 64px;
  text-align: center;
  color: var(--color-text-primary);
  margin-top: 32px;

  .icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    opacity: 0.8;
    max-width: 500px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }
`;

const ErrorState = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #ef4444;

  .content {
    flex: 1;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
  }
`;

const RetryButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px 0;
  color: var(--color-text-primary);
`;

const HabitsPage = () => {
  const {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabitCompletion,
    isHabitCompletedToday,
    getTodayLog,
    getHabitStats,
    fetchHabits
  } = useHabits();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    status: 'all',
    sort: 'created_desc'
  });

  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    // Ensure habits is an array before processing
    if (!Array.isArray(habits)) {
      return [];
    }
    
    let filtered = [...habits];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(habit =>
        habit.name.toLowerCase().includes(searchLower) ||
        (habit.description && habit.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(habit => habit.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(habit => habit.difficulty === parseInt(filters.difficulty));
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(habit => habit.is_active);
          break;
        case 'completed_today':
          filtered = filtered.filter(habit => isHabitCompletedToday(habit.id));
          break;
        case 'pending_today':
          filtered = filtered.filter(habit => !isHabitCompletedToday(habit.id));
          break;
        case 'on_streak':
          filtered = filtered.filter(habit => (habit.current_streak || 0) > 0);
          break;
        default:
          break;
      }
    }

    // Sort
    switch (filters.sort) {
      case 'created_asc':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'created_desc':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'streak_desc':
        filtered.sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0));
        break;
      case 'completion_desc':
        filtered.sort((a, b) => {
          const aRate = a.total_logs > 0 ? (a.successful_logs / a.total_logs) : 0;
          const bRate = b.total_logs > 0 ? (b.successful_logs / b.total_logs) : 0;
          return bRate - aRate;
        });
        break;
      case 'points_desc':
        filtered.sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [habits, filters, isHabitCompletedToday]);

  // Calculate statistics
  const completedToday = habits.filter(habit => isHabitCompletedToday(habit.id)).length;

  const handleCreateHabit = async (habitData) => {
    await createHabit(habitData);
    setShowCreateModal(false);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowCreateModal(true);
  };

  const handleUpdateHabit = async (habitData) => {
    await updateHabit(editingHabit.id, habitData);
    setEditingHabit(null);
    setShowCreateModal(false);
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      await deleteHabit(habitId);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingHabit(null);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      difficulty: 'all',
      status: 'all',
      sort: 'created_desc'
    });
  };

  if (loading && habits.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>
            <Target size={32} />
            My Habits
          </Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error && habits.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>
            <Target size={32} />
            My Habits
          </Title>
        </Header>
        <ErrorState>
          <AlertCircle size={24} />
          <div className="content">
            <h3>Failed to load habits</h3>
            <p>{error}</p>
          </div>
          <RetryButton onClick={fetchHabits}>
            Retry
          </RetryButton>
        </ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <Target size={32} />
          My Habits
        </Title>
        <AddButton
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          {loading ? <Loader size={20} className="spin" /> : <Plus size={20} />}
          Add Habit
        </AddButton>
      </Header>

      {habits.length > 0 && (
        <HabitFilters
          filters={filters}
          onFiltersChange={setFilters}
          view={view}
          onViewChange={setView}
          totalHabits={habits.length}
          filteredCount={filteredHabits.length}
          completedToday={completedToday}
          onClearFilters={handleClearFilters}
        />
      )}

      {filteredHabits.length > 0 ? (
        <HabitsGrid $view={view}>
          {filteredHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              stats={getHabitStats(habit)}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              isCompletedToday={isHabitCompletedToday(habit.id)}
            >
              <HabitTrackingButton
                habit={habit}
                todayLog={getTodayLog(habit.id)}
                onTrack={logHabitCompletion}
                loading={loading}
              />
            </HabitCard>
          ))}
        </HabitsGrid>
      ) : habits.length === 0 ? (
        <EmptyState>
          <div className="icon">🎯</div>
          <h3>Start Your Wellness Journey!</h3>
          <p>
            Create your first habit to begin tracking your progress. Whether it's building 
            good habits or breaking bad ones, we'll help you stay motivated with points, 
            streaks, and achievements.
          </p>
          <AddButton onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Create Your First Habit
          </AddButton>
        </EmptyState>
      ) : (
        <EmptyState>
          <div className="icon">🔍</div>
          <h3>No habits match your filters</h3>
          <p>
            Try adjusting your search criteria or clearing filters to see more habits.
          </p>
          <RetryButton onClick={handleClearFilters}>
            Clear Filters
          </RetryButton>
        </EmptyState>
      )}

      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        editingHabit={editingHabit}
        loading={loading}
      />
    </PageContainer>
  );
};

export default HabitsPage;
