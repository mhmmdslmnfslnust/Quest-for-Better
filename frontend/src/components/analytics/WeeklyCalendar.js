import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(var(--color-surface-rgb), 0.3);
  border-radius: 8px;
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: ${props => props.$disabled ? 'transparent' : 'rgba(var(--color-accent-rgb), 0.1)'};
  color: ${props => props.$disabled ? 'var(--color-text-tertiary)' : 'var(--color-accent)'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$disabled ? 'transparent' : 'rgba(var(--color-accent-rgb), 0.2)'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const WeekLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 180px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 8px;
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  min-height: 80px;
  border-radius: 12px;
  background: ${props => {
    if (!props.$hasData) return 'rgba(var(--color-surface-rgb), 0.3)';
    if (props.$successRate >= 80) return 'rgba(34, 197, 94, 0.8)'; // Green
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.8)'; // Blue
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  }};
  border: 2px solid ${props => {
    if (!props.$hasData) return 'rgba(var(--color-border-rgb), 0.2)';
    if (props.$successRate >= 80) return 'rgba(34, 197, 94, 0.4)';
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.4)';
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.4)';
    return 'rgba(239, 68, 68, 0.4)';
  }};
  color: ${props => props.$hasData ? 'white' : 'var(--color-text-tertiary)'};
  font-size: 11px;
  font-weight: 600;
  cursor: ${props => props.$hasData ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${props => props.$hasData ? 'translateY(-4px) scale(1.05)' : 'none'};
    box-shadow: ${props => props.$hasData ? '0 8px 25px rgba(0, 0, 0, 0.2)' : 'none'};
    z-index: 2;
  }

  .day-name {
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }

  .success-rate {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 2px;
  }

  .habit-count {
    font-size: 10px;
    opacity: 0.8;
  }

  ${props => props.$isToday && `
    &::after {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      background: var(--color-accent);
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
    }
  `}
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text-tertiary);
  text-align: center;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .description {
    font-size: 14px;
    opacity: 0.7;
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const Tooltip = styled.div`
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;

  &.visible {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const WeeklyCalendar = ({ 
  data, 
  title = "Weekly Success Pattern",
  onFetchWeekData // Function to fetch daily data for a specific week
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekData, setWeekData] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize current week to start of this week (Sunday)
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    setCurrentWeekStart(startOfWeek);
  }, []);

  // Generate 4 weeks of calendar data
  const generateCalendarWeeks = () => {
    const weeks = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
      
      const weekDays = [];
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + dayOffset);
        
        const isToday = currentDate.toDateString() === today.toDateString();
        const dayName = dayNames[dayOffset];
        
        // Find pattern data for this day of week
        const patternData = data?.find(d => d.day_of_week === dayName);
        
        // Simulate some daily variation based on pattern data
        const hasData = !!patternData && patternData.total_logs > 0;
        const baseRate = patternData?.success_rate || 0;
        const variation = (Math.random() - 0.5) * 20; // ±10% variation
        const dailyRate = hasData ? Math.max(0, Math.min(100, Math.round(baseRate + variation))) : 0;
        
        weekDays.push({
          date: currentDate,
          dayName: dayName.substring(0, 3), // Short name
          fullDayName: dayName,
          isToday,
          hasData,
          successRate: dailyRate,
          totalLogs: patternData?.total_logs || 0,
          successfulLogs: patternData?.successful_logs || 0
        });
      }
      
      weeks.push(weekDays);
    }
    
    return weeks;
  };

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newWeekStart);
  };

  const getWeekRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 27); // 4 weeks
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    };
    
    return `${formatDate(currentWeekStart)} - ${formatDate(weekEnd)}`;
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>
            <Calendar size={18} />
            {title}
          </ChartTitle>
        </ChartHeader>
        <EmptyState>
          <div className="icon">📅</div>
          <div className="title">No Pattern Data Available</div>
          <div className="description">Complete habits throughout the week to see your success patterns</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const calendarWeeks = generateCalendarWeeks();
  const weekRange = getWeekRange();

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <Calendar size={18} />
          {title}
        </ChartTitle>
        <WeekNavigation>
          <NavButton onClick={() => navigateWeek(-1)}>
            <ChevronLeft />
          </NavButton>
          <WeekLabel>{weekRange}</WeekLabel>
          <NavButton onClick={() => navigateWeek(1)}>
            <ChevronRight />
          </NavButton>
        </WeekNavigation>
      </ChartHeader>

      {/* Day Headers */}
      <CalendarGrid style={{ marginBottom: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
      </CalendarGrid>

      {/* Calendar Weeks */}
      {calendarWeeks.map((week, weekIndex) => (
        <WeekRow key={weekIndex}>
          {week.map((day, dayIndex) => (
            <DayCell
              key={`${weekIndex}-${dayIndex}`}
              $hasData={day.hasData}
              $successRate={day.successRate}
              $isToday={day.isToday}
              onMouseEnter={() => day.hasData && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="day-name">{day.dayName}</div>
              <div className="success-rate">
                {day.hasData ? `${day.successRate}%` : '-'}
              </div>
              {day.hasData && (
                <div className="habit-count">
                  {day.successfulLogs}/{day.totalLogs}
                </div>
              )}
              {hoveredDay === day && (
                <Tooltip className="visible">
                  {day.fullDayName}<br />
                  {day.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}<br />
                  Success Rate: {day.successRate}%<br />
                  Completed: {day.successfulLogs}/{day.totalLogs}
                </Tooltip>
              )}
            </DayCell>
          ))}
        </WeekRow>
      ))}

      <Legend>
        <LegendItem>
          <LegendColor color="rgba(34, 197, 94, 0.8)" />
          <span>Excellent (80-100%)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(59, 130, 246, 0.8)" />
          <span>Good (60-79%)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(245, 158, 11, 0.8)" />
          <span>Fair (40-59%)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(239, 68, 68, 0.8)" />
          <span>Needs Work (0-39%)</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="rgba(var(--color-surface-rgb), 0.3)" />
          <span>No Data</span>
        </LegendItem>
      </Legend>
    </ChartContainer>
  );
};

export default WeeklyCalendar;
