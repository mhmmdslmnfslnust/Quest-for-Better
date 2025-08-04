import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TrendingUp, BarChart3, Calendar, Brain, Award, Users, RefreshCw, Filter, Download, Activity, Target, Zap } from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import TrendChart from '../components/analytics/TrendChart';
import PerformanceBarChart from '../components/analytics/PerformanceBarChart';
import DonutChart from '../components/analytics/DonutChart';
import WellnessScore from '../components/analytics/WellnessScore';
import PatternHeatmap from '../components/analytics/PatternHeatmap';
import SmartInsights from '../components/analytics/SmartInsights';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-background) 0%, 
    rgba(var(--color-accent-rgb), 0.03) 100%
  );
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(var(--color-background-rgb), 0.95);
  backdrop-filter: blur(20px);
  border-radius: 0 0 24px 24px;
  padding: 32px 0 24px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(var(--color-border-rgb), 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(var(--color-surface-rgb), 0.8);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(var(--color-surface-rgb), 1);
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--color-accent-rgb), 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const QuickStatCard = styled.div`
  background: rgba(var(--color-surface-rgb), 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(var(--color-accent-rgb), 0.15);
    border-color: rgba(var(--color-accent-rgb), 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$color || 'linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary, var(--color-accent)))'};
  }
`;

const QuickStatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QuickStatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickStatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$bgColor || 'rgba(var(--color-accent-rgb), 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$iconColor || 'var(--color-accent)'};
`;

const QuickStatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const QuickStatSubtext = styled.div`
  font-size: 12px;
  color: var(--color-text-tertiary);
  font-weight: 500;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  padding: 6px;
  background: rgba(var(--color-surface-rgb), 0.5);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-border-rgb), 0.1);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--color-accent-rgb), 0.3);
    border-radius: 2px;
  }
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.$active 
    ? 'var(--color-accent)' 
    : 'transparent'
  };
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--color-text-secondary)'
  };
  border: none;
  border-radius: 12px;
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.$active 
      ? 'var(--color-accent)' 
      : 'rgba(var(--color-accent-rgb), 0.1)'
    };
    color: ${props => props.$active 
      ? 'white' 
      : 'var(--color-accent)'
    };
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  ${props => props.$active && css`
    animation: ${fadeInUp} 0.5s ease-out;
  `}
  
  /* Ensure proper rendering even with null data */
  min-height: 200px;
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.$minWidth || '400px'}, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GridItem = styled.div`
  grid-column: ${props => props.$span || 'span 1'};
  
  @media (max-width: 1200px) {
    grid-column: span 1;
  }
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin: 48px 0;

  h3 {
    color: #ef4444;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 600;
  }

  p {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;

  .loading-text {
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  background: rgba(var(--color-surface-rgb), 0.5);
  border-radius: 20px;
  border: 2px dashed rgba(var(--color-border-rgb), 0.3);

  .icon {
    width: 64px;
    height: 64px;
    color: var(--color-text-tertiary);
    margin-bottom: 16px;
  }

  h3 {
    color: var(--color-text-primary);
    margin-bottom: 8px;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    color: var(--color-text-secondary);
    margin: 0;
    max-width: 400px;
  }
`;

// Safe data wrapper for preventing null/undefined errors
const SafeDataWrapper = ({ children, data, fallback = null }) => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return fallback || (
        <EmptyState>
          <BarChart3 className="icon" />
          <h3>No Data Available</h3>
          <p>Start tracking habits to see analytics here</p>
        </EmptyState>
      );
    }
    return children;
  } catch (error) {
    console.warn('SafeDataWrapper error:', error);
    return fallback || (
      <EmptyState>
        <BarChart3 className="icon" />
        <h3>Data Error</h3>
        <p>Unable to display this chart. Please refresh the page.</p>
      </EmptyState>
    );
  }
};

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { 
    overview, 
    patterns, 
    correlations, 
    predictions, 
    achievements, 
    community, 
    loading, 
    error, 
    fetchAnalytics 
  } = useAnalytics();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'patterns', label: 'Patterns', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'community', label: 'Community', icon: Users }
  ];

  if (loading && !overview) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div className="loading-text">Analyzing your habit data...</div>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <h3>Unable to Load Analytics</h3>
          <p>{error}</p>
          <ActionButton onClick={handleRefresh} style={{ marginTop: '16px' }}>
            <RefreshCw size={16} />
            Try Again
          </ActionButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <ErrorBoundary fallbackMessage="Unable to load analytics dashboard. This might be due to data inconsistencies or network issues.">
      <PageContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>
                <BarChart3 size={32} />
                Analytics Dashboard
              </Title>
              <Subtitle>
                Deep insights into your habit journey and performance patterns
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              <ActionButton onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </ActionButton>
              <ActionButton>
                <Filter size={16} />
                Filter
              </ActionButton>
              <ActionButton>
                <Download size={16} />
                Export
              </ActionButton>
            </HeaderActions>
          </HeaderContent>
        </Header>

      {/* Quick Stats Cards */}
      <QuickStatsGrid>
        <QuickStatCard $color="linear-gradient(90deg, #10b981, #059669)">
          <QuickStatHeader>
            <QuickStatTitle>Wellness Score</QuickStatTitle>
            <QuickStatIcon $bgColor="rgba(16, 185, 129, 0.1)" $iconColor="#10b981">
              <Activity size={20} />
            </QuickStatIcon>
          </QuickStatHeader>
          <QuickStatValue>{overview?.wellness_score || 0}</QuickStatValue>
          <QuickStatSubtext>
            {overview?.wellness_score >= 80 ? 'Excellent' : 
             overview?.wellness_score >= 60 ? 'Good' : 
             overview?.wellness_score >= 40 ? 'Fair' : 'Needs Improvement'}
          </QuickStatSubtext>
        </QuickStatCard>

        <QuickStatCard $color="linear-gradient(90deg, #3b82f6, #2563eb)">
          <QuickStatHeader>
            <QuickStatTitle>Success Rate</QuickStatTitle>
            <QuickStatIcon $bgColor="rgba(59, 130, 246, 0.1)" $iconColor="#3b82f6">
              <Target size={20} />
            </QuickStatIcon>
          </QuickStatHeader>
          <QuickStatValue>{overview?.insights?.avg_success_rate || 0}%</QuickStatValue>
          <QuickStatSubtext>Last 30 days average</QuickStatSubtext>
        </QuickStatCard>

        <QuickStatCard $color="linear-gradient(90deg, #8b5cf6, #7c3aed)">
          <QuickStatHeader>
            <QuickStatTitle>Active Days</QuickStatTitle>
            <QuickStatIcon $bgColor="rgba(139, 92, 246, 0.1)" $iconColor="#8b5cf6">
              <Calendar size={20} />
            </QuickStatIcon>
          </QuickStatHeader>
          <QuickStatValue>{overview?.insights?.active_days || 0}</QuickStatValue>
          <QuickStatSubtext>Out of {overview?.insights?.total_days || 30} days</QuickStatSubtext>
        </QuickStatCard>

        <QuickStatCard $color="linear-gradient(90deg, #f59e0b, #d97706)">
          <QuickStatHeader>
            <QuickStatTitle>Total Points</QuickStatTitle>
            <QuickStatIcon $bgColor="rgba(245, 158, 11, 0.1)" $iconColor="#f59e0b">
              <Zap size={20} />
            </QuickStatIcon>
          </QuickStatHeader>
          <QuickStatValue>{overview?.user_stats?.total_points || 0}</QuickStatValue>
          <QuickStatSubtext>Level {overview?.user_stats?.level || 1} Adventurer</QuickStatSubtext>
        </QuickStatCard>
      </QuickStatsGrid>

      {/* Tab Navigation */}
      <TabContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </Tab>
        ))}
      </TabContainer>

      {/* Tab Content */}
      <TabContent $active={activeTab === 'overview'}>
        <SafeDataWrapper data={overview}>
          <Grid $minWidth="350px">
            <GridItem $span="2">
              <SafeDataWrapper data={overview?.performance_trend}>
                <TrendChart data={overview?.performance_trend} title="Performance Trend" />
              </SafeDataWrapper>
            </GridItem>
            <GridItem>
              <WellnessScore score={overview?.wellness_score || 0} />
            </GridItem>
            <GridItem>
              <SafeDataWrapper data={overview?.category_performance}>
                <DonutChart 
                  data={overview?.category_performance} 
                  title="Category Performance"
                  dataKey="success_rate"
                  nameKey="category"
                />
              </SafeDataWrapper>
            </GridItem>
            <GridItem $span="2">
              <SafeDataWrapper data={overview?.top_habits}>
                <PerformanceBarChart 
                  data={overview?.top_habits} 
                  title="Top Performing Habits"
                />
              </SafeDataWrapper>
            </GridItem>
          </Grid>
        </SafeDataWrapper>
      </TabContent>

      <TabContent $active={activeTab === 'patterns'}>
        <SafeDataWrapper data={patterns}>
          <Grid>
            <GridItem $span="2">
              <SafeDataWrapper data={patterns?.daily_patterns}>
                <PatternHeatmap 
                  data={patterns?.daily_patterns} 
                  title="Daily Success Patterns"
                />
              </SafeDataWrapper>
            </GridItem>
            <GridItem>
              <SafeDataWrapper data={patterns?.monthly_progression}>
                <DonutChart 
                  data={patterns?.monthly_progression} 
                  title="Monthly Progress"
                  dataKey="success_rate"
                  nameKey="month"
                />
              </SafeDataWrapper>
            </GridItem>
          </Grid>
        </SafeDataWrapper>
      </TabContent>

      <TabContent $active={activeTab === 'insights'}>
        <SafeDataWrapper data={predictions || correlations}>
          <Grid>
            <GridItem $span="2">
              <SmartInsights 
                predictions={predictions}
                correlations={correlations}
              />
            </GridItem>
          </Grid>
        </SafeDataWrapper>
      </TabContent>

      <TabContent $active={activeTab === 'achievements'}>
        <SafeDataWrapper data={achievements}>
          <Grid>
            <GridItem>
              <SafeDataWrapper data={achievements?.rarity_breakdown}>
                <DonutChart 
                  data={achievements?.rarity_breakdown} 
                  title="Achievement Rarity"
                  dataKey="completion_rate"
                  nameKey="rarity"
                />
              </SafeDataWrapper>
            </GridItem>
            <GridItem>
              <SafeDataWrapper data={achievements?.category_breakdown}>
                <DonutChart 
                  data={achievements?.category_breakdown} 
                  title="Category Completion"
                  dataKey="completion_rate"
                  nameKey="category"
                />
              </SafeDataWrapper>
            </GridItem>
            <GridItem $span="2">
              <SafeDataWrapper data={achievements?.next_achievements}>
                <PerformanceBarChart 
                  data={achievements?.next_achievements} 
                  title="Next Achievements"
                />
              </SafeDataWrapper>
            </GridItem>
          </Grid>
        </SafeDataWrapper>
      </TabContent>

      <TabContent $active={activeTab === 'community'}>
        <SafeDataWrapper data={community}>
          <Grid>
            <GridItem>
              <WellnessScore 
                score={community?.user_rankings?.points_percentile || 0} 
                title="Community Ranking"
              />
            </GridItem>
            <GridItem>
              <SafeDataWrapper data={community?.category_comparison}>
                <DonutChart 
                  data={community?.category_comparison} 
                  title="Category vs Community"
                  dataKey="user_success_rate"
                  nameKey="category"
                />
              </SafeDataWrapper>
            </GridItem>
          </Grid>
        </SafeDataWrapper>
      </TabContent>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default StatsPage;
