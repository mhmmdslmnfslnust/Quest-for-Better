import React from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin: 16px 0;
`;

const HeatmapContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const HeatmapTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DayCell = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  background-color: ${props => {
    if (!props.$hasData) return 'rgba(255, 255, 255, 0.05)';
    const intensity = props.$successRate / 100;
    if (intensity >= 0.8) return 'var(--color-success)';
    if (intensity >= 0.6) return 'rgba(16, 185, 129, 0.7)';
    if (intensity >= 0.4) return 'rgba(16, 185, 129, 0.5)';
    if (intensity >= 0.2) return 'rgba(16, 185, 129, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  }};
  
  color: ${props => 
    props.$hasData && props.$successRate >= 40 
      ? 'white' 
      : 'var(--color-text-primary)'
  };
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
    
    &::after {
      content: '${props => props.$hasData ? `${props.$successRate}% success` : 'No data'}';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      margin-bottom: 4px;
      z-index: 100;
    }
  }
`;

const WeekdayLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

const WeekdayLabel = styled.div`
  width: 32px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-text-secondary);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const PatternHeatmap = ({ data, title, icon }) => {
  // Generate last 90 days
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayData = data.find(d => d.date === dateString);
      
      days.push({
        date: dateString,
        day: date.getDate(),
        successRate: dayData ? dayData.success_rate : 0,
        hasData: !!dayData && dayData.total_habits > 0
      });
    }
    
    return days;
  };

  const days = generateDays();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <HeatmapContainer>
      <HeatmapTitle>
        {icon && <span>{icon}</span>}
        {title}
      </HeatmapTitle>
      
      <WeekdayLabels>
        {weekdays.map((day, index) => (
          <WeekdayLabel key={index}>{day}</WeekdayLabel>
        ))}
      </WeekdayLabels>
      
      <GridContainer>
        {days.map((day, index) => (
          <DayCell
            key={day.date}
            $hasData={day.hasData}
            $successRate={day.successRate}
          >
            {day.day}
          </DayCell>
        ))}
      </GridContainer>
      
      <Legend>
        <span>Less</span>
        <LegendItem>
          <LegendColor color="rgba(255, 255, 255, 0.05)" />
          <span>No data</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(239, 68, 68, 0.3)" />
          <span>0-20%</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(16, 185, 129, 0.3)" />
          <span>20-40%</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(16, 185, 129, 0.5)" />
          <span>40-60%</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(16, 185, 129, 0.7)" />
          <span>60-80%</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="var(--color-success)" />
          <span>80-100%</span>
        </LegendItem>
        <span>More</span>
      </Legend>
    </HeatmapContainer>
  );
};

export default PatternHeatmap;
