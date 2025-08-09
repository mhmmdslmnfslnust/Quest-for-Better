import React from 'react';
import styled from 'styled-components';

const InsightsContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const InsightsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid ${props => 
    props.$type === 'improvement' ? 'var(--color-warning)' :
    props.$type === 'success' ? 'var(--color-success)' :
    props.$type === 'recommendation' ? 'var(--color-info)' :
    'var(--color-primary)'
  };
`;

const InsightIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const InsightText = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
`;

const InsightAction = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: var(--color-text-secondary);
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  h4 {
    font-size: 18px;
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const SmartInsights = ({ insights = [], recommendations = [] }) => {
  const allInsights = [
    ...insights.map(insight => ({ ...insight, type: 'insight' })),
    ...recommendations.map(rec => ({ ...rec, type: 'recommendation' }))
  ];

  const getInsightIcon = (type, subType) => {
    if (type === 'recommendation') {
      switch (subType) {
        case 'improvement': return '🎯';
        case 'expansion': return '🚀';
        case 'challenge': return '🏆';
        default: return '💡';
      }
    }
    
    switch (subType) {
      case 'pattern': return '📊';
      case 'success': return '✨';
      case 'streak': return '🔥';
      case 'category': return '📈';
      default: return '🧠';
    }
  };

  if (allInsights.length === 0) {
    return (
      <InsightsContainer>
        <InsightsTitle>
          🧠 Smart Insights
        </InsightsTitle>
        <EmptyState>
          <div className="icon">🤖</div>
          <h4>Gathering Intelligence</h4>
          <p>
            Keep logging your habits! Our AI will analyze your patterns 
            and provide personalized insights to optimize your wellness journey.
          </p>
        </EmptyState>
      </InsightsContainer>
    );
  }

  return (
    <InsightsContainer>
      <InsightsTitle>
        🧠 Smart Insights & Recommendations
      </InsightsTitle>
      
      <InsightsList>
        {allInsights.map((item, index) => (
          <InsightItem key={index} $type={item.subType || item.type}>
            <InsightIcon>
              {getInsightIcon(item.type, item.subType)}
            </InsightIcon>
            <InsightContent>
              <InsightTitle>
                {item.title}
              </InsightTitle>
              <InsightText>
                {item.description}
              </InsightText>
              {item.action && (
                <InsightAction>
                  {item.action}
                </InsightAction>
              )}
            </InsightContent>
          </InsightItem>
        ))}
      </InsightsList>
    </InsightsContainer>
  );
};

export default SmartInsights;
