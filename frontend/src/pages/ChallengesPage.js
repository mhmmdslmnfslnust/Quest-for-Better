import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, Trophy, Target, TrendingUp, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ChallengeGallery from '../components/challenges/ChallengeGallery';
import ChallengeModal from '../components/challenges/ChallengeModal';
import { useChallenges } from '../hooks/useChallenges';

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
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 600px;
`;

const TabSection = styled.div`
  margin-bottom: 32px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--color-text-primary)'
  };
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${props => props.$active 
    ? 'rgba(59, 130, 246, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'rgba(255, 255, 255, 0.15)'
    };
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

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
  color: var(--color-text-secondary);
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: #ef4444;
  margin-bottom: 24px;
`;

const ChallengesPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  
  const {
    challenges,
    userChallenges,
    trendingChallenges,
    loading,
    error,
    stats,
    fetchChallenges,
    fetchUserChallenges,
    fetchTrendingChallenges,
    joinChallenge,
    updateProgress,
    leaveChallenge
  } = useChallenges();

  useEffect(() => {
    fetchChallenges();
    fetchUserChallenges();
    fetchTrendingChallenges();
  }, [fetchChallenges, fetchUserChallenges, fetchTrendingChallenges]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdateProgress = async (challengeId) => {
    try {
      const result = await updateProgress(challengeId);
      if (result.success) {
        toast.success(result.message);
        fetchUserChallenges(); // Refresh user challenges
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await joinChallenge(challengeId);
      toast.success('Successfully joined challenge!');
      fetchUserChallenges(); // Refresh user challenges
    } catch (error) {
      toast.error('Failed to join challenge');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      const result = await leaveChallenge(challengeId);
      if (result.success) {
        toast.success(result.message);
        setSelectedChallenge(null); // Close the modal
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to leave challenge');
    }
  };

  const getTabChallenges = () => {
    switch (activeTab) {
      case 'available':
        return challenges.filter(c => !userChallenges.some(uc => uc.id === c.id));
      case 'my-challenges':
        return userChallenges;
      case 'trending':
        return trendingChallenges;
      default:
        return challenges;
    }
  };

  const getTabStats = () => {
    const totalChallenges = challenges.length;
    const activeChallenges = userChallenges.filter(c => c.status === 'active').length;
    const completedChallenges = userChallenges.filter(c => c.status === 'completed').length;
    
    return { totalChallenges, activeChallenges, completedChallenges };
  };

  const tabStats = getTabStats();

  if (loading && challenges.length === 0) {
    return (
      <PageContainer>
        <LoadingContainer>
          <div>Loading challenges...</div>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <Trophy />
          Challenges
        </Title>
        <Subtitle>
          Community challenges and competitions to boost your habit-building journey. 
          Compete with others, earn bonus rewards, and stay motivated together!
        </Subtitle>
      </Header>

      {error && (
        <ErrorContainer>
          <h3>Error loading challenges</h3>
          <p>{error}</p>
        </ErrorContainer>
      )}

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatValue>{tabStats.totalChallenges}</StatValue>
          <StatLabel>
            <Target size={14} />
            Total Challenges
          </StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatValue>{tabStats.activeChallenges}</StatValue>
          <StatLabel>
            <Zap size={14} />
            Active Challenges
          </StatLabel>
        </StatCard>
        
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatValue>{tabStats.completedChallenges}</StatValue>
          <StatLabel>
            <Trophy size={14} />
            Completed
          </StatLabel>
        </StatCard>
      </StatsGrid>

      <TabSection>
        <TabButtons>
          <TabButton
            $active={activeTab === 'available'}
            onClick={() => handleTabChange('available')}
          >
            <Target size={16} />
            Available
          </TabButton>
          <TabButton
            $active={activeTab === 'my-challenges'}
            onClick={() => handleTabChange('my-challenges')}
          >
            <Users size={16} />
            My Challenges
          </TabButton>
          <TabButton
            $active={activeTab === 'trending'}
            onClick={() => handleTabChange('trending')}
          >
            <TrendingUp size={16} />
            Trending
          </TabButton>
        </TabButtons>

        <ChallengeGallery
          challenges={getTabChallenges()}
          onViewDetails={handleChallengeClick}
          onJoinChallenge={handleJoinChallenge}
          onUpdateProgress={handleUpdateProgress}
          isUserChallenges={activeTab === 'my-challenges'}
          loading={loading}
          stats={stats}
        />
      </TabSection>

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onJoin={() => handleJoinChallenge(selectedChallenge.id)}
          onUpdateProgress={() => handleUpdateProgress(selectedChallenge.id)}
          onLeaveChallenge={() => handleLeaveChallenge(selectedChallenge.id)}
          isUserChallenge={userChallenges.some(uc => uc.id === selectedChallenge.id)}
        />
      )}
    </PageContainer>
  );
};

export default ChallengesPage;
