import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, TrendingUp } from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';
import CategoryFilter from '../components/achievements/CategoryFilter';
import AchievementGallery from '../components/achievements/AchievementGallery';
import AchievementModal from '../components/achievements/AchievementModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StatIcon = styled.div`
  color: ${props => props.$color || 'var(--color-text-secondary)'};
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const StatSubtext = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
  opacity: 0.8;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const AchievementsPage = () => {
  const location = useLocation();
  const {
    filteredAchievements,
    categories,
    stats,
    loading,
    error,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus
  } = useAchievements();

  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Handle navigation state to pre-select earned achievements
  useEffect(() => {
    if (location.state?.defaultStatus && location.state.defaultStatus !== selectedStatus) {
      setSelectedStatus(location.state.defaultStatus);
    }
  }, [location.state, selectedStatus, setSelectedStatus]);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleModalClose = () => {
    setSelectedAchievement(null);
  };

  if (error) {
    return (
      <PageContainer>
        <Title>
          <Trophy size={32} />
          Achievements
        </Title>
        <div style={{ 
          textAlign: 'center', 
          padding: '64px', 
          color: 'var(--color-text-secondary)' 
        }}>
          <p>Failed to load achievements. Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <Trophy size={32} />
          Achievements
        </Title>
        <Subtitle>
          Unlock badges, collect rewards, and track your wellness milestones. 
          Complete habits to earn achievements and show off your progress!
        </Subtitle>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon $color="#10b981">
              <Award size={24} />
            </StatIcon>
            <StatValue>{stats.earned}</StatValue>
            <StatLabel>Earned</StatLabel>
            <StatSubtext>of {stats.total} total</StatSubtext>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon $color="#6366f1">
              <Target size={24} />
            </StatIcon>
            <StatValue>{stats.percentage}%</StatValue>
            <StatLabel>Complete</StatLabel>
            <StatSubtext>achievement progress</StatSubtext>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon $color="#f59e0b">
              <TrendingUp size={24} />
            </StatIcon>
            <StatValue>{stats.totalPoints}</StatValue>
            <StatLabel>Bonus Points</StatLabel>
            <StatSubtext>from achievements</StatSubtext>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon $color="#8b5cf6">
              <Trophy size={24} />
            </StatIcon>
            <StatValue>{stats.byRarity.legendary}</StatValue>
            <StatLabel>Legendary</StatLabel>
            <StatSubtext>rarest achievements</StatSubtext>
          </StatCard>
        </StatsGrid>
      </Header>

      <FilterSection>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          stats={stats}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
        />
      </FilterSection>

      <AchievementGallery
        achievements={filteredAchievements}
        loading={loading}
        onAchievementClick={handleAchievementClick}
        emptyMessage={selectedCategory === 'all' ? "No achievements available" : `No ${selectedCategory} achievements found`}
        emptyDescription="Complete habits to unlock achievements and earn rewards!"
      />

      <AchievementModal
        achievement={selectedAchievement}
        isOpen={!!selectedAchievement}
        onClose={handleModalClose}
      />
    </PageContainer>
  );
};

export default AchievementsPage;
