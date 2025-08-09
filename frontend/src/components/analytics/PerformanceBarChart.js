import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
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

const PerformanceBarChart = ({ data, title, dataKey = 'success_rate', color = 'var(--color-primary)', icon }) => {
  // Data validation
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
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Start tracking to see performance data</div>
        </div>
      </ChartContainer>
    );
  }

  // Filter and validate data
  const validData = data.filter(item => item && item[dataKey] !== undefined);
  
  if (validData.length === 0) {
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
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Valid Data</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Data exists but contains no valid performance metrics</div>
        </div>
      </ChartContainer>
    );
  }

  const CustomTooltipComponent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <div className="label">{label}</div>
          <div className="value">
            {`Success Rate: ${payload[0].value}%`}
          </div>
          {payload[0].payload.total_logs && (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
              Total Logs: {payload[0].payload.total_logs}
            </div>
          )}
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartTitle>
        {icon && <span>{icon}</span>}
        {title}
      </ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={validData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="category" 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltipComponent />} />
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PerformanceBarChart;
