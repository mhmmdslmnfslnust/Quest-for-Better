import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  width: 100%;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const CustomTooltip = styled.div`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 14px;
  
  .label {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .value {
    color: var(--color-primary);
  }
`;

const DonutChart = ({ data, title, icon, colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'], dataKey = 'value', nameKey = 'name' }) => {
  // Data validation and preprocessing
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>
          {icon && <span>{icon}</span>}
          {title}
        </ChartTitle>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Data Available</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Start tracking to see analytics here</div>
        </div>
      </ChartContainer>
    );
  }

  const CustomTooltipComponent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <CustomTooltip>
          <div className="label">{data[nameKey] || data.name}</div>
          <div className="value">
            {data[dataKey] || data.value} ({data.percentage}%)
          </div>
        </CustomTooltip>
      );
    }
    return null;
  };

  // Process and validate data with proper key mapping
  const processedData = data
    .filter(item => item && (item[dataKey] !== undefined || item.value !== undefined))
    .map((item, index) => {
      const value = item[dataKey] !== undefined ? item[dataKey] : item.value;
      const name = item[nameKey] !== undefined ? item[nameKey] : item.name;
      return {
        ...item,
        name: name || `Item ${index + 1}`,
        value: typeof value === 'number' ? value : parseFloat(value) || 0
      };
    });

  // Calculate total for percentages
  const total = processedData.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <ChartContainer>
        <ChartTitle>
          {icon && <span>{icon}</span>}
          {title}
        </ChartTitle>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '300px',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Data Available</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>All values are zero</div>
        </div>
      </ChartContainer>
    );
  }

  // Add percentage to processed data
  const finalData = processedData.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <ChartContainer>
      <ChartTitle>
        {icon && <span>{icon}</span>}
        {title}
      </ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={finalData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {finalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltipComponent />} />
        </PieChart>
      </ResponsiveContainer>
      <LegendContainer>
        {finalData.map((entry, index) => (
          <LegendItem key={`legend-${entry.name}-${index}`}>
            <LegendColor color={colors[index % colors.length]} />
            <span>{entry.name}</span>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartContainer>
  );
};

export default DonutChart;
