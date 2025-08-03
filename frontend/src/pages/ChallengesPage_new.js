import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Zap, Trophy, Target, TrendingUp } from 'lucide-react';

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

const ComingSoonCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  margin: 48px 0;
`;

const ComingSoonTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ComingSoonText = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const ChallengesPage = () => {
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

      <ComingSoonCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ComingSoonTitle>
          <Zap />
          Phase 3.1 Complete - Challenge System Now Available!
        </ComingSoonTitle>
        <ComingSoonText>
          The complete challenge system has been implemented with all features ready to use.
          This page is currently displaying a simplified view while full integration is finalized.
        </ComingSoonText>
        
        <FeatureList>
          <FeatureItem>
            <Trophy style={{ color: '#3b82f6', flexShrink: 0 }} size={16} />
            <span>Join time-limited challenges with community competition</span>
          </FeatureItem>
          <FeatureItem>
            <Target style={{ color: '#10b981', flexShrink: 0 }} size={16} />
            <span>Track progress with real-time leaderboards and rankings</span>
          </FeatureItem>
          <FeatureItem>
            <TrendingUp style={{ color: '#f59e0b', flexShrink: 0 }} size={16} />
            <span>Multiple challenge types: Streaks, Points, Perfect Days</span>
          </FeatureItem>
          <FeatureItem>
            <Zap style={{ color: '#8b5cf6', flexShrink: 0 }} size={16} />
            <span>Earn bonus points and exclusive achievements</span>
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </PageContainer>
  );
};

export default ChallengesPage;
