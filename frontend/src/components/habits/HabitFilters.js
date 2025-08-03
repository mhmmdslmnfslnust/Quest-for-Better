import React from 'react';
import styled from 'styled-components';
import { Search, Filter, Grid, List, SortAsc } from 'lucide-react';

const FiltersContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: ${props => props.$hasSecondRow ? '16px' : '0'};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 40px 10px 16px;
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  opacity: 0.7;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-text-primary);
  font-size: 14px;
  min-width: 120px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ViewButton = styled.button`
  background: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
  border: none;
  color: var(--color-text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const StatsInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span`
  background: var(--color-primary);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ClearFilters = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 12px;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'social', label: 'Social' },
  { value: 'learning', label: 'Learning' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'other', label: 'Other' }
];

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: '1', label: 'Easy' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'Hard' },
  { value: '4', label: 'Very Hard' },
  { value: '5', label: 'Expert' }
];

const statusOptions = [
  { value: 'all', label: 'All Habits' },
  { value: 'active', label: 'Active' },
  { value: 'completed_today', label: 'Completed Today' },
  { value: 'pending_today', label: 'Pending Today' },
  { value: 'on_streak', label: 'On Streak' }
];

const sortOptions = [
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'streak_desc', label: 'Best Streak' },
  { value: 'completion_desc', label: 'Best Completion Rate' },
  { value: 'points_desc', label: 'Most Points' }
];

const HabitFilters = ({
  filters,
  onFiltersChange,
  view,
  onViewChange,
  totalHabits,
  filteredCount,
  completedToday,
  onClearFilters
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.difficulty !== 'all' || 
    filters.status !== 'all' ||
    filters.sort !== 'created_desc';

  return (
    <FiltersContainer>
      <FiltersRow $hasSecondRow>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search habits by name or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
        </SearchContainer>

        <ViewToggle>
          <ViewButton
            $active={view === 'grid'}
            onClick={() => onViewChange('grid')}
          >
            <Grid size={16} />
            Grid
          </ViewButton>
          <ViewButton
            $active={view === 'list'}
            onClick={() => onViewChange('list')}
          >
            <List size={16} />
            List
          </ViewButton>
        </ViewToggle>
      </FiltersRow>

      <FiltersRow>
        <FilterGroup>
          <FilterLabel>
            <Filter size={14} />
            Category:
          </FilterLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Difficulty:</FilterLabel>
          <Select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status:</FilterLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <SortAsc size={14} />
            Sort:
          </FilterLabel>
          <Select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            {sortOptions.map(sort => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </Select>
        </FilterGroup>

        {hasActiveFilters && (
          <ClearFilters onClick={onClearFilters}>
            Clear Filters
          </ClearFilters>
        )}
      </FiltersRow>

      <StatsRow>
        <StatsInfo>
          Showing <Badge>{filteredCount}</Badge> of <Badge>{totalHabits}</Badge> habits
          {completedToday > 0 && (
            <>
              • <Badge>{completedToday}</Badge> completed today
            </>
          )}
        </StatsInfo>
      </StatsRow>
    </FiltersContainer>
  );
};

export default HabitFilters;
