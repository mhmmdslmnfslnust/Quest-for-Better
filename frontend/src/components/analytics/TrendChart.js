import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ChartContainer = styled.div`
  background: rgba(var(--color-surface-rgb), 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
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
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary, var(--color-accent)));
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartSubtitle = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$isPositive 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'
  };
  color: ${props => props.$isPositive ? '#22c55e' : '#ef4444'};
`;

const CurrentValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-primary);
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CustomTooltip = styled.div`
  background: rgba(var(--color-surface-rgb), 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--color-border-rgb), 0.3);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  
  .label {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .metrics {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    
    .metric-label {
      color: var(--color-text-secondary);
    }
    
    .metric-value {
      font-weight: 600;
      color: var(--color-accent);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-tertiary);
  
  .icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  .message {
    font-size: 14px;
    font-weight: 500;
  }
`;

const TrendChart = ({ 
  data, 
  title, 
  subtitle,
  dataKey = 'success_rate', 
  color = 'var(--color-accent)', 
  icon,
  showArea = false,
  showTrend = true 
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [data]);

  // Data validation
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <TitleSection>
            <ChartTitle>
              {icon && <span>{icon}</span>}
              {title}
            </ChartTitle>
            {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
          </TitleSection>
        </ChartHeader>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '280px',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📈</div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Trend Data</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Start tracking habits to see performance trends</div>
        </div>
      </ChartContainer>
    );
  }

  const CustomTooltipComponent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <CustomTooltip>
          <div className="label">{new Date(label).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}</div>
          <div className="metrics">
            <div className="metric">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{data.success_rate}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Completed:</span>
              <span className="metric-value">{data.completed_habits}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Points:</span>
              <span className="metric-value">{data.points_earned}</span>
            </div>
          </div>
        </CustomTooltip>
      );
    }
    return null;
  };

  const calculateTrend = () => {
    if (!data || data.length < 2) return { change: 0, isPositive: true };
    
    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);
    
    if (recent.length === 0 || previous.length === 0) return { change: 0, isPositive: true };
    
    const recentAvg = recent.reduce((sum, d) => sum + (d[dataKey] || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + (d[dataKey] || 0), 0) / previous.length;
    
    const change = recentAvg - previousAvg;
    return { change: Math.abs(change), isPositive: change >= 0 };
  };

  const getCurrentValue = () => {
    if (!data || data.length === 0) return 0;
    const latest = data[data.length - 1];
    return latest[dataKey] || 0;
  };

  const trend = calculateTrend();
  const currentValue = getCurrentValue();

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <TitleSection>
            <ChartTitle>
              {icon}
              {title}
            </ChartTitle>
            {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
          </TitleSection>
        </ChartHeader>
        <EmptyState>
          <TrendingUp className="icon" />
          <div className="message">No data available yet</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <ChartContainer>
      <ChartHeader>
        <TitleSection>
          <ChartTitle>
            {icon}
            {title}
          </ChartTitle>
          {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
        </TitleSection>
        <StatsSection>
          <CurrentValue>
            {dataKey === 'success_rate' ? `${currentValue}%` : currentValue}
          </CurrentValue>
          {showTrend && (
            <TrendIndicator $isPositive={trend.isPositive}>
              {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.change.toFixed(1)}
              {dataKey === 'success_rate' ? '%' : ''}
            </TrendIndicator>
          )}
        </StatsSection>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={280}>
        <ChartComponent key={animationKey} data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(var(--color-border-rgb), 0.2)"
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="var(--color-text-tertiary)"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="var(--color-text-tertiary)"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltipComponent />} />
          <DataComponent
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            {...(showArea && {
              fill: color,
              fillOpacity: 0.1
            })}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TrendChart;
