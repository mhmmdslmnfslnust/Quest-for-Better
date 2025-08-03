import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, Trophy, Clock, Target } from 'lucide-react';
import ChallengeCard from './ChallengeCard';

const Container = styled.div`
  width: 100%;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 14px;
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const FilterOptions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
`;

const FilterChip = styled.button`
  padding: 8px 16px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${props => props.$active 
    ? 'rgba(59, 130, 246, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  border-radius: 20px;
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--color-text-primary)'
  };
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 32px;
  color: var(--color-text-secondary);
  
  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.6;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-text-primary);
  }
  
  p {
    font-size: 16px;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ChallengeGallery = ({ 
  challenges = [], 
  showStats = true,
  onJoinChallenge,
  onUpdateProgress,
  onViewDetails,
  isUserChallenges = false,
  loading = false,
  stats = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  // Filter challenges based on search and filters
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || challenge.challenge_type === typeFilter;
    
    const matchesDuration = durationFilter === 'all' || 
      (durationFilter === 'short' && challenge.duration_days <= 7) ||
      (durationFilter === 'medium' && challenge.duration_days > 7 && challenge.duration_days <= 30) ||
      (durationFilter === 'long' && challenge.duration_days > 30);
    
    return matchesSearch && matchesStatus && matchesType && matchesDuration;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'expired', label: 'Expired' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'streak', label: 'Streak' },
    { value: 'points_sprint', label: 'Points Sprint' },
    { value: 'new_habits', label: 'New Habits' },
    { value: 'perfect_month', label: 'Perfect Month' },
    { value: 'habit_consistency', label: 'Consistency' }
  ];

  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: 'short', label: 'Short (≤1 week)' },
    { value: 'medium', label: 'Medium (1-4 weeks)' },
    { value: 'long', label: 'Long (>1 month)' }
  ];

  return (
    <Container>
      {showStats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalAvailable || challenges.length}</StatValue>
            <StatLabel>
              <Target size={16} />
              {isUserChallenges ? 'Total Joined' : 'Available'}
            </StatLabel>
          </StatCard>
          
          {isUserChallenges && (
            <>
              <StatCard>
                <StatValue>{stats.active || 0}</StatValue>
                <StatLabel>
                  <Clock size={16} />
                  Active
                </StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{stats.completed || 0}</StatValue>
                <StatLabel>
                  <Trophy size={16} />
                  Completed
                </StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{stats.completionRate || 0}%</StatValue>
                <StatLabel>
                  <Users size={16} />
                  Success Rate
                </StatLabel>
              </StatCard>
            </>
          )}
          
          {!isUserChallenges && (
            <StatCard>
              <StatValue>{stats.trending || 0}</StatValue>
              <StatLabel>
                <Users size={16} />
                Trending
              </StatLabel>
            </StatCard>
          )}
        </StatsGrid>
      )}
      
      <FilterSection>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterToggle onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} />
          Filters
        </FilterToggle>
      </FilterSection>
      
      <AnimatePresence>
        {showFilters && (
          <FilterOptions
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isUserChallenges && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginRight: '8px' }}>
                  Status:
                </span>
                {statusOptions.map(option => (
                  <FilterChip
                    key={option.value}
                    $active={statusFilter === option.value}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginRight: '8px' }}>
                Type:
              </span>
              {typeOptions.map(option => (
                <FilterChip
                  key={option.value}
                  $active={typeFilter === option.value}
                  onClick={() => setTypeFilter(option.value)}
                >
                  {option.label}
                </FilterChip>
              ))}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginRight: '8px' }}>
                Duration:
              </span>
              {durationOptions.map(option => (
                <FilterChip
                  key={option.value}
                  $active={durationFilter === option.value}
                  onClick={() => setDurationFilter(option.value)}
                >
                  {option.label}
                </FilterChip>
              ))}
            </div>
          </FilterOptions>
        )}
      </AnimatePresence>
      
      <Grid>
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={onJoinChallenge}
              onUpdateProgress={onUpdateProgress}
              onViewDetails={onViewDetails}
              isUserChallenge={isUserChallenges}
              loading={loading}
            />
          ))
        ) : (
          <EmptyState>
            <div className="icon">🏆</div>
            <h3>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || durationFilter !== 'all'
                ? 'No matching challenges'
                : isUserChallenges 
                  ? 'No challenges joined yet'
                  : 'No challenges available'
              }
            </h3>
            <p>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || durationFilter !== 'all'
                ? 'Try adjusting your search terms or filters to find more challenges.'
                : isUserChallenges
                  ? 'Join some challenges to start tracking your progress and compete with others!'
                  : 'Check back later for new challenges to join and conquer!'
              }
            </p>
          </EmptyState>
        )}
      </Grid>
    </Container>
  );
};

export default ChallengeGallery;
