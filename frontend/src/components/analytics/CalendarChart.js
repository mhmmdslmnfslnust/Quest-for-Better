import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';

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
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 120px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
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
  height: 48px;
  min-height: 48px;
  border-radius: 8px;
  background: ${props => {
    if (!props.$hasData) return 'rgba(var(--color-surface-rgb), 0.3)';
    if (props.$successRate >= 80) return 'rgba(34, 197, 94, 0.8)'; // Green
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.8)'; // Blue
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  }};
  border: 1px solid ${props => {
    if (!props.$hasData) return 'rgba(var(--color-border-rgb), 0.2)';
    if (props.$successRate >= 80) return 'rgba(34, 197, 94, 0.3)';
    if (props.$successRate >= 60) return 'rgba(59, 130, 246, 0.3)';
    if (props.$successRate >= 40) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  }};
  color: ${props => props.$hasData ? 'white' : 'var(--color-text-tertiary)'};
  font-size: 11px;
  font-weight: 600;
  cursor: ${props => props.$hasData ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: ${props => props.$hasData ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$hasData ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }

  .day-number {
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }

  .success-rate {
    font-size: 10px;
    opacity: 0.9;
    margin-top: 2px;
  }

  ${props => props.$isToday && `
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 6px;
      height: 6px;
      background: var(--color-accent);
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
    }
  `}
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
  margin-top: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const Tooltip = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
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
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const CalendarChart = ({ 
  data, 
  title = "Monthly Calendar", 
  onFetchDailyData // Function to fetch daily data for a specific month
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(false);

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Initialize with available months from data
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setMonthlyData(data);
      // Set to the most recent month with data
      const sortedData = [...data].sort((a, b) => new Date(b.sort_key) - new Date(a.sort_key));
      const latestMonth = new Date(sortedData[0].sort_key + '-01');
      setSelectedMonth(latestMonth);
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
    
    // Check if this month has data
    const monthKey = newMonth.toISOString().substring(0, 7);
    const hasData = monthlyData.some(m => m.sort_key === monthKey);
    
    if (hasData) {
      setSelectedMonth(newMonth);
    }
  };

  const getAvailableMonths = () => {
    return monthlyData.map(m => new Date(m.sort_key + '-01')).sort((a, b) => a - b);
  };

  const canNavigate = (direction) => {
    const availableMonths = getAvailableMonths();
    const currentIndex = availableMonths.findIndex(m => 
      m.getFullYear() === selectedMonth.getFullYear() && 
      m.getMonth() === selectedMonth.getMonth()
    );
    
    if (direction === -1) return currentIndex > 0;
    if (direction === 1) return currentIndex < availableMonths.length - 1;
    return false;
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
        totalHabits: dayData?.total_habits || 0
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
          <div className="description">Start tracking habits to see your calendar progress</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const calendarDays = generateCalendarDays();
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <Calendar size={18} />
          {title}
        </ChartTitle>
        <MonthNavigation>
          <NavButton
            $disabled={!canNavigate(-1)}
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft />
          </NavButton>
          <MonthLabel>{monthName}</MonthLabel>
          <NavButton
            $disabled={!canNavigate(1)}
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight />
          </NavButton>
        </MonthNavigation>
      </ChartHeader>

      {loading ? (
        <EmptyState>
          <div className="icon">⏳</div>
          <div className="title">Loading...</div>
          <div className="description">Fetching calendar data</div>
        </EmptyState>
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
                onMouseEnter={() => day.hasData && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="day-number" style={{ 
                  opacity: day.isCurrentMonth ? 1 : 0.3 
                }}>
                  {day.dayNumber}
                </div>
                {day.hasData && day.isCurrentMonth && (
                  <div className="success-rate">{day.successRate}%</div>
                )}
                {hoveredDay === day && (
                  <Tooltip className="visible">
                    {day.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}<br />
                    {day.completedHabits}/{day.totalHabits} habits ({day.successRate}%)
                  </Tooltip>
                )}
              </DayCell>
            ))}
          </CalendarGrid>

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
        </>
      )}
    </ChartContainer>
  );
};

export default CalendarChart;
