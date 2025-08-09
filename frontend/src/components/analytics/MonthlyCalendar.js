import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Calendar, Eye, EyeOff } from 'lucide-react';

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

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MonthNavigation = styled.div`
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

const MonthLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  min-width: 140px;
  text-align: center;
`;

const ViewToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.$active ? 'var(--color-accent)' : 'rgba(var(--color-surface-rgb), 0.3)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--color-accent)' : 'rgba(var(--color-border-rgb), 0.2)'};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--color-accent)' : 'rgba(var(--color-accent-rgb), 0.1)'};
    color: ${props => props.$active ? 'white' : 'var(--color-accent)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: rgba(var(--color-border-rgb), 0.1);
  border-radius: 12px;
  padding: 2px;
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
  min-height: 60px;
  border-radius: 8px;
  background: ${props => {
    if (!props.$isCurrentMonth) return 'rgba(var(--color-surface-rgb), 0.2)';
    if (!props.$hasData) return 'rgba(55, 65, 81, 0.3)'; // Cool gray for no data
    
    // 6 color categories based on success rate
    if (props.$successRate >= 90) return 'rgba(16, 185, 129, 0.9)'; // Excellent - Dark Green
    if (props.$successRate >= 75) return 'rgba(34, 197, 94, 0.8)';  // Great - Green
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.8)'; // Good - Blue
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.8)'; // Fair - Orange
    if (props.$successRate >= 20) return 'rgba(239, 68, 68, 0.8)';  // Poor - Red
    return 'rgba(127, 29, 29, 0.8)'; // Very Poor - Dark Red
  }};
  
  border: 2px solid ${props => {
    if (!props.$isCurrentMonth) return 'transparent';
    if (!props.$hasData) return 'rgba(75, 85, 99, 0.4)'; // Subtle gray border for no data
    
    if (props.$successRate >= 90) return 'rgba(16, 185, 129, 0.4)';
    if (props.$successRate >= 75) return 'rgba(34, 197, 94, 0.4)';
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.4)';
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.4)';
    if (props.$successRate >= 20) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(127, 29, 29, 0.4)';
  }};
  
  color: ${props => {
    if (!props.$isCurrentMonth) return 'var(--color-text-tertiary)';
    if (!props.$hasData) return 'var(--color-text-secondary)';
    return 'white';
  }};
  
  font-size: 12px;
  font-weight: 600;
  cursor: ${props => (props.$hasData && props.$isCurrentMonth) ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${props => (props.$hasData && props.$isCurrentMonth) ? 'translateY(-2px) scale(1.05)' : 'none'};
    box-shadow: ${props => (props.$hasData && props.$isCurrentMonth) ? '0 6px 20px rgba(0, 0, 0, 0.2)' : 'none'};
    z-index: 2;
  }

  .day-number {
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: ${props => props.$showData ? '2px' : '0'};
  }

  .success-rate {
    font-size: 11px;
    font-weight: 700;
    opacity: 0.9;
  }

  .habit-count {
    font-size: 9px;
    opacity: 0.8;
    margin-top: 1px;
  }

  ${props => props.$isToday && `
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: var(--color-accent);
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
      z-index: 1;
    }
  `}
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text-secondary);
  font-size: 14px;
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
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const LegendColor = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const Tooltip = styled.div`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &.visible {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.95);
  }
`;

const MonthlyCalendar = ({ 
  data, 
  title = "Daily Success Calendar",
  onFetchDailyData // Function to fetch daily data for a specific month
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [showData, setShowData] = useState(false); // Default: Color only mode
  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(false);

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize with current month
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setMonthlyData(data);
      // Set to the most recent month with data or current month
      const sortedData = [...data].sort((a, b) => new Date(b.sort_key) - new Date(a.sort_key));
      if (sortedData.length > 0) {
        const latestMonth = new Date(sortedData[0].sort_key + '-01');
        setSelectedMonth(latestMonth);
      }
    }
  }, [data]);

  // Fetch daily data when month changes
  useEffect(() => {
    if (selectedMonth && onFetchDailyData) {
      fetchDailyDataForMonth();
    }
  }, [selectedMonth, onFetchDailyData]);

  const fetchDailyDataForMonth = async () => {
    if (!onFetchDailyData) return;
    
    setLoading(true);
    const monthKey = selectedMonth.toISOString().substring(0, 7); // YYYY-MM format
    
    try {
      const result = await onFetchDailyData(monthKey);
      setDailyData(result || []);
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setDailyData([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const today = new Date();
    
    // Generate 6 weeks (42 days) to ensure consistent calendar size
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      // Find daily data for this date
      const dayData = dailyData.find(d => d.date === currentDate.toISOString().split('T')[0]);
      
      days.push({
        date: currentDate,
        dayNumber: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        hasData: !!dayData,
        successRate: dayData?.success_rate || 0,
        completedHabits: dayData?.completed_habits || 0,
        totalHabits: dayData?.total_habits || 0,
        pointsEarned: dayData?.points_earned || 0
      });
    }
    
    return days;
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
          <div className="title">No Data Available</div>
          <div className="description">Start tracking habits to see your daily calendar</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const calendarDays = generateCalendarDays();
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const legendItems = [
    { color: 'rgba(16, 185, 129, 0.9)', label: 'Excellent (90-100%)' },
    { color: 'rgba(34, 197, 94, 0.8)', label: 'Great (75-89%)' },
    { color: 'rgba(59, 130, 246, 0.8)', label: 'Good (60-74%)' },
    { color: 'rgba(245, 158, 11, 0.8)', label: 'Fair (40-59%)' },
    { color: 'rgba(239, 68, 68, 0.8)', label: 'Poor (20-39%)' },
    { color: 'rgba(127, 29, 29, 0.8)', label: 'Very Poor (0-19%)' },
    { color: 'rgba(var(--color-surface-rgb), 0.4)', label: 'No Data' }
  ];

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <Calendar size={18} />
          {title}
        </ChartTitle>
        <Controls>
          <MonthNavigation>
            <NavButton onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </NavButton>
            <MonthLabel>{monthName}</MonthLabel>
            <NavButton onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </NavButton>
          </MonthNavigation>
          
          <ViewToggle $active={!showData} onClick={() => setShowData(!showData)}>
            {showData ? <EyeOff size={14} /> : <Eye size={14} />}
            {showData ? 'Color Only' : 'Show Data'}
          </ViewToggle>
        </Controls>
      </ChartHeader>

      {loading ? (
        <LoadingIndicator>Loading calendar data...</LoadingIndicator>
      ) : (
        <>
          <CalendarGrid>
            {dayHeaders.map(day => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}
            {calendarDays.map((day, index) => (
              <DayCell
                key={index}
                $hasData={day.hasData && day.isCurrentMonth}
                $successRate={day.successRate}
                $isToday={day.isToday}
                $isCurrentMonth={day.isCurrentMonth}
                $showData={showData}
                onMouseEnter={() => day.hasData && day.isCurrentMonth && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="day-number">
                  {day.dayNumber}
                </div>
                {showData && day.hasData && day.isCurrentMonth && (
                  <>
                    <div className="success-rate">{day.successRate}%</div>
                    <div className="habit-count">{day.completedHabits}/{day.totalHabits}</div>
                  </>
                )}
                {hoveredDay === day && (
                  <Tooltip className="visible">
                    <strong>{day.date.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}</strong><br />
                    Success Rate: {day.successRate}%<br />
                    Habits: {day.completedHabits}/{day.totalHabits}<br />
                    Points Earned: {day.pointsEarned}
                  </Tooltip>
                )}
              </DayCell>
            ))}
          </CalendarGrid>

          <Legend>
            {legendItems.map((item, index) => (
              <LegendItem key={index}>
                <LegendColor color={item.color} />
                <span>{item.label}</span>
              </LegendItem>
            ))}
          </Legend>
        </>
      )}
    </ChartContainer>
  );
};

export default MonthlyCalendar;
