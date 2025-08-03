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
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const RefreshButton = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const QuickStats = styled.div`
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
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color}20;
  margin: 0 auto 16px;
  color: ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const ChallengesPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    getAvailableChallenges,
    clearError
  } = useChallenges();

  // Load user challenges when component mounts
  useEffect(() => {
    fetchUserChallenges();
  }, [fetchUserChallenges]);

  const handleJoinChallenge = async (challengeId) => {
    const result = await joinChallenge(challengeId);
    if (result.success) {
      toast.success(result.message);
      setModalOpen(false);
      setSelectedChallenge(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateProgress = async (challengeId) => {
    const result = await updateProgress(challengeId);
    if (result.success) {
      toast.success(result.message);
      if (result.data?.completed) {
        toast.success(`🎉 You earned ${result.data.points_awarded} points!`, {
          duration: 5000,
        });
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleViewDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const handleRetry = () => {
    clearError();
    fetchChallenges();
    fetchUserChallenges();
    fetchTrendingChallenges();
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'my-challenges':
        return {
          data: userChallenges,
          isUserChallenges: true,
          showStats: true
        };
      case 'trending':
        return {
          data: trendingChallenges,
          isUserChallenges: false,
          showStats: false
        };
      case 'available':
      default:
        return {
          data: getAvailableChallenges(),
          isUserChallenges: false,
          showStats: false
        };
    }
  };

  const tabData = getTabData();

  if (loading && challenges.length === 0 && userChallenges.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>
            <Zap />
            Challenges
          </Title>
          <Subtitle>
            Join time-limited challenges to earn bonus points and compete with the community!
          </Subtitle>
        </Header>
        
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
          <Zap />
          Challenges
        </Title>
        <Subtitle>
          Join time-limited challenges to earn bonus points and compete with the community!
        </Subtitle>
      </Header>

      {error && (
        <ErrorContainer>
          <h3>Unable to load challenges</h3>
          <p>{error}</p>
          <RefreshButton onClick={handleRetry}>
            Try Again
          </RefreshButton>
        </ErrorContainer>
      )}

      {/* Quick Stats Overview */}
      <QuickStats>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon $color="#3b82f6">
            <Target />
          </StatIcon>
          <StatValue>{stats.totalAvailable}</StatValue>
          <StatLabel>Available Challenges</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon $color="#059669">
            <Trophy />
          </StatIcon>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon $color="#dc2626">
            <Zap />
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active Challenges</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon $color="#7c3aed">
            <TrendingUp />
          </StatIcon>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>Success Rate</StatLabel>
        </StatCard>
      </QuickStats>

      <TabSection>
        <TabButtons>
          <TabButton
            $active={activeTab === 'available'}
            onClick={() => setActiveTab('available')}
          >
            <Target size={16} />
            Available ({getAvailableChallenges().length})
          </TabButton>
          
          <TabButton
            $active={activeTab === 'my-challenges'}
            onClick={() => setActiveTab('my-challenges')}
          >
            <Trophy size={16} />
            My Challenges ({userChallenges.length})
          </TabButton>
          
          <TabButton
            $active={activeTab === 'trending'}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp size={16} />
            Trending ({trendingChallenges.length})
          </TabButton>
        </TabButtons>

        <ChallengeGallery
          challenges={tabData.data}
          showStats={tabData.showStats}
          onJoinChallenge={handleJoinChallenge}
          onUpdateProgress={handleUpdateProgress}
          onViewDetails={handleViewDetails}
          isUserChallenges={tabData.isUserChallenges}
          loading={loading}
          stats={stats}
        />
      </TabSection>

      <ChallengeModal
        challenge={selectedChallenge}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedChallenge(null);
        }}
        onJoin={handleJoinChallenge}
        onUpdateProgress={handleUpdateProgress}
        isUserChallenge={tabData.isUserChallenges}
      />
    </PageContainer>
  );
};

export default ChallengesPage;
