import React, { useState } from 'react';
import styled from 'styled-components';
import { TrendingUp, BarChart3, Calendar, Brain, Award, Users } from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';
import LoadingSpinner from '../components/LoadingSpinner';
import TrendChart from '../components/analytics/TrendChart';
import PerformanceBarChart from '../components/analytics/PerformanceBarChart';
import DonutChart from '../components/analytics/DonutChart';
import WellnessScore from '../components/analytics/WellnessScore';
import PatternHeatmap from '../components/analytics/PatternHeatmap';
import SmartInsights from '../components/analytics/SmartInsights';

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
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.$active 
    ? 'var(--color-primary)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.$active 
    ? 'white' 
    : 'var(--color-text-primary)'
  };
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: ${props => props.$active 
      ? 'var(--color-primary-dark)' 
      : 'rgba(255, 255, 255, 0.15)'
    };
    transform: translateY(-1px);
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  grid-column: ${props => props.$span || 'span 1'};
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: var(--color-error);
  
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    loading, 
    error, 
    overview, 
    patterns, 
    correlations, 
    predictions, 
    achievements, 
    community, 
    insights 
  } = useAnalytics();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'patterns', label: 'Patterns', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'community', label: 'Community', icon: Users }
  ];

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header>
          <Title>
            <BarChart3 size={32} />
            Advanced Analytics
          </Title>
        </Header>
        <ErrorContainer>
          <h3>Failed to Load Analytics</h3>
          <p>{error}</p>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <BarChart3 size={32} />
          Advanced Analytics
        </Title>
        <Subtitle>
          Deep insights into your habit patterns, progress trends, and personalized recommendations
        </Subtitle>
      </Header>

      <TabContainer>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </Tab>
          );
        })}
      </TabContainer>

      {/* Overview Tab */}
      <TabContent $active={activeTab === 'overview'}>
        {overview && (
          <>
            <Grid>
              <GridItem>
                <WellnessScore 
                  score={overview.wellness_score} 
                  insights={[
                    `${overview.insights.active_days}/${overview.insights.total_days} active days`,
                    `${overview.insights.avg_success_rate}% average success rate`,
                    `${overview.insights.consistency_score}% consistency score`
                  ]}
                />
              </GridItem>
              <GridItem>
                <Grid>
                  <MetricCard>
                    <MetricValue>{overview.user_stats.total_points?.toLocaleString() || 0}</MetricValue>
                    <MetricLabel>Total Points</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{overview.user_stats.current_streak || 0}</MetricValue>
                    <MetricLabel>Current Streak</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{overview.user_stats.longest_streak || 0}</MetricValue>
                    <MetricLabel>Best Streak</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{overview.top_habits?.length || 0}</MetricValue>
                    <MetricLabel>Active Habits</MetricLabel>
                  </MetricCard>
                </Grid>
              </GridItem>
            </Grid>

            <Grid>
              <GridItem $span="2">
                <TrendChart
                  data={overview.performance_trend || []}
                  title="Success Rate Trend"
                  dataKey="success_rate"
                  color="var(--color-success)"
                  icon="📈"
                />
              </GridItem>
            </Grid>

            <Grid>
              <GridItem>
                <PerformanceBarChart
                  data={overview.category_performance || []}
                  title="Category Performance"
                  dataKey="success_rate"
                  color="var(--color-info)"
                  icon="📊"
                />
              </GridItem>
              <GridItem>
                <DonutChart
                  data={overview.category_performance?.map(cat => ({
                    name: cat.category,
                    value: cat.total_points || 0
                  })) || []}
                  title="Points by Category"
                  icon="🎯"
                />
              </GridItem>
            </Grid>
          </>
        )}
      </TabContent>

      {/* Patterns Tab */}
      <TabContent $active={activeTab === 'patterns'}>
        {patterns && (
          <>
            <Grid>
              <GridItem $span="2">
                <PatternHeatmap
                  data={overview?.performance_trend || []}
                  title="Success Pattern Heatmap"
                  icon="🗓️"
                />
              </GridItem>
            </Grid>

            <Grid>
              <GridItem>
                <PerformanceBarChart
                  data={patterns.daily_patterns?.map(day => ({
                    category: day.day_of_week,
                    success_rate: day.success_rate,
                    total_logs: day.total_logs
                  })) || []}
                  title="Daily Success Patterns"
                  dataKey="success_rate"
                  color="var(--color-warning)"
                  icon="📅"
                />
              </GridItem>
              <GridItem>
                <TrendChart
                  data={patterns.monthly_progression || []}
                  title="Monthly Progress"
                  dataKey="success_rate"
                  color="var(--color-primary)"
                  icon="📆"
                />
              </GridItem>
            </Grid>
          </>
        )}
      </TabContent>

      {/* Insights Tab */}
      <TabContent $active={activeTab === 'insights'}>
        <Grid>
          <GridItem $span="2">
            <SmartInsights
              insights={insights}
              recommendations={predictions?.recommendations || []}
            />
          </GridItem>
        </Grid>

        {correlations && correlations.habit_synergies?.length > 0 && (
          <Grid>
            <GridItem $span="2">
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔗 Habit Synergies
                </h3>
                {correlations.habit_synergies.map((synergy, index) => (
                  <div key={index} style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)'
                  }}>
                    <strong>{synergy.habit1_name}</strong> + <strong>{synergy.habit2_name}</strong>
                    <span style={{ 
                      float: 'right', 
                      color: 'var(--color-success)',
                      fontWeight: '600'
                    }}>
                      {synergy.correlation_strength}% synergy
                    </span>
                  </div>
                ))}
              </div>
            </GridItem>
          </Grid>
        )}

        {predictions && (
          <Grid>
            <GridItem>
              <MetricCard>
                <MetricValue>{predictions.success_probability}%</MetricValue>
                <MetricLabel>Success Probability</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <MetricCard>
                <MetricValue>{predictions.recent_performance?.success_rate || 0}%</MetricValue>
                <MetricLabel>Recent Success Rate</MetricLabel>
              </MetricCard>
            </GridItem>
          </Grid>
        )}
      </TabContent>

      {/* Achievements Tab */}
      <TabContent $active={activeTab === 'achievements'}>
        {achievements && (
          <Grid>
            <GridItem>
              <MetricCard>
                <MetricValue>{achievements.overview?.earned_achievements || 0}</MetricValue>
                <MetricLabel>Achievements Earned</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <MetricCard>
                <MetricValue>{achievements.overview?.completion_percentage || 0}%</MetricValue>
                <MetricLabel>Completion Rate</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <DonutChart
                data={achievements.rarity_breakdown?.map(rarity => ({
                  name: rarity.rarity,
                  value: rarity.earned_count
                })) || []}
                title="Achievements by Rarity"
                icon="🏆"
              />
            </GridItem>
            <GridItem>
              <PerformanceBarChart
                data={achievements.category_breakdown?.map(cat => ({
                  category: cat.category,
                  success_rate: cat.completion_rate
                })) || []}
                title="Achievement Categories"
                dataKey="success_rate"
                color="var(--color-secondary)"
                icon="🎖️"
              />
            </GridItem>
          </Grid>
        )}
      </TabContent>

      {/* Community Tab */}
      <TabContent $active={activeTab === 'community'}>
        {community && (
          <Grid>
            <GridItem>
              <MetricCard>
                <MetricValue>#{community.user_rankings?.points_rank || 'N/A'}</MetricValue>
                <MetricLabel>Points Rank</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <MetricCard>
                <MetricValue>{community.user_rankings?.points_percentile || 0}%</MetricValue>
                <MetricLabel>Better Than</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <MetricCard>
                <MetricValue>#{community.user_rankings?.streak_rank || 'N/A'}</MetricValue>
                <MetricLabel>Streak Rank</MetricLabel>
              </MetricCard>
            </GridItem>
            <GridItem>
              <MetricCard>
                <MetricValue>#{community.user_rankings?.achievement_rank || 'N/A'}</MetricValue>
                <MetricLabel>Achievement Rank</MetricLabel>
              </MetricCard>
            </GridItem>
            
            {community.category_comparison && (
              <GridItem $span="2">
                <PerformanceBarChart
                  data={community.category_comparison.map(cat => ({
                    category: cat.category,
                    success_rate: cat.difference_from_average,
                    user_rate: cat.user_success_rate,
                    community_rate: cat.community_avg_success_rate
                  }))}
                  title="vs Community Average"
                  dataKey="success_rate"
                  color="var(--color-info)"
                  icon="🌍"
                />
              </GridItem>
            )}
          </Grid>
        )}
      </TabContent>
    </PageContainer>
  );
};

export default StatsPage;
