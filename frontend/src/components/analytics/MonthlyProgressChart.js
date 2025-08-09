import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

const ViewToggle = styled.div`
  display: flex;
  background: rgba(var(--color-surface-rgb), 0.5);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.$active ? 'var(--color-accent)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  border: none;
  border-radius: 6px;
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

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 100px;
  text-align: center;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text-secondary);
  font-size: 14px;
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

const MonthlyProgressChart = ({ 
  data, 
  title = "Monthly Progress", 
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  onFetchDailyData // Function to fetch daily data for a specific month
}) => {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'single'
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Initialize data and selected month
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setMonthlyData(data);
      // Set default selected month to the most recent one
      const sortedData = [...data].sort((a, b) => new Date(b.sort_key) - new Date(a.sort_key));
      setSelectedMonth(sortedData[0]);
    }
  }, [data]);

  // Get available months for navigation
  const getAvailableMonths = () => {
    if (!monthlyData || monthlyData.length === 0) return [];
    return [...monthlyData].sort((a, b) => new Date(a.sort_key) - new Date(b.sort_key));
  };

  // Navigate to previous/next month
  const navigateMonth = (direction) => {
    const availableMonths = getAvailableMonths();
    const currentIndex = availableMonths.findIndex(m => m.sort_key === selectedMonth?.sort_key);
    
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    }
  };

  // Fetch daily data for selected month
  const fetchDailyDataForMonth = async (monthData) => {
    if (!monthData || !onFetchDailyData) return;
    
    setLoadingDaily(true);
    try {
      const dailyResult = await onFetchDailyData(monthData.sort_key);
      if (dailyResult && Array.isArray(dailyResult)) {
        // Process the daily data to ensure proper format
        const processedDailyData = dailyResult.map(item => ({
          day: parseInt(item.day),
          date: item.date,
          success_rate: item.success_rate || 0,
          completed_habits: item.completed_habits || 0,
          total_habits: item.total_habits || 0,
          points_earned: item.points_earned || 0
        }));
        setDailyData(processedDailyData);
      } else {
        setDailyData([]);
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setDailyData([]);
    } finally {
      setLoadingDaily(false);
    }
  };

  // Update daily data when selected month changes or when switching to single view
  useEffect(() => {
    if (selectedMonth && viewMode === 'single') {
      fetchDailyDataForMonth(selectedMonth);
    }
  }, [selectedMonth, viewMode, onFetchDailyData]);

  // Custom tooltip component
  const CustomTooltipComponent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <CustomTooltip>
          <div className="label">
            {viewMode === 'timeline' ? data.month : `Day ${data.day}`}
          </div>
          <div className="value">
            Success Rate: {data.success_rate}%
          </div>
          {viewMode === 'single' && (
            <div className="value">
              Completed: {data.completed_habits}/{data.total_habits}
            </div>
          )}
        </CustomTooltip>
      );
    }
    return null;
  };

  // Check if data is available
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
          <div className="icon">📊</div>
          <div className="title">No Data Available</div>
          <div className="description">Start tracking habits to see your monthly progress</div>
        </EmptyState>
      </ChartContainer>
    );
  }

  const availableMonths = getAvailableMonths();
  const currentIndex = availableMonths.findIndex(m => m?.sort_key === selectedMonth?.sort_key);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <Calendar size={18} />
          {title}
        </ChartTitle>
        <Controls>
          <ViewToggle>
            <ToggleButton
              $active={viewMode === 'timeline'}
              onClick={() => setViewMode('timeline')}
            >
              <TrendingUp size={14} />
              Timeline
            </ToggleButton>
            <ToggleButton
              $active={viewMode === 'single'}
              onClick={() => setViewMode('single')}
            >
              <BarChart3 size={14} />
              Single Month
            </ToggleButton>
          </ViewToggle>
          
          {viewMode === 'single' && (
            <MonthNavigation>
              <NavButton
                $disabled={currentIndex <= 0}
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft />
              </NavButton>
              <MonthLabel>
                {selectedMonth?.month || 'Select Month'}
              </MonthLabel>
              <NavButton
                $disabled={currentIndex >= availableMonths.length - 1}
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight />
              </NavButton>
            </MonthNavigation>
          )}
        </Controls>
      </ChartHeader>

      {viewMode === 'single' && loadingDaily ? (
        <LoadingIndicator>Loading daily data...</LoadingIndicator>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {viewMode === 'timeline' ? (
            // Monthly timeline view (donut chart)
            <PieChart>
              <Pie
                data={monthlyData.map((item, index) => ({
                  ...item,
                  percentage: ((item.success_rate / monthlyData.reduce((sum, m) => sum + m.success_rate, 0)) * 100).toFixed(1)
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="success_rate"
              >
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipComponent />} />
            </PieChart>
          ) : (
            // Single month daily view (bar chart)
            dailyData.length > 0 ? (
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  stroke="rgba(255,255,255,0.3)"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  stroke="rgba(255,255,255,0.3)"
                />
                <Tooltip content={<CustomTooltipComponent />} />
                <Bar 
                  dataKey="success_rate" 
                  fill="var(--color-accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'var(--color-text-tertiary)'
              }}>
                No daily data available for {selectedMonth?.month}
              </div>
            )
          )}
        </ResponsiveContainer>
      )}

      {viewMode === 'timeline' && (
        <LegendContainer>
          {monthlyData.map((entry, index) => (
            <LegendItem key={`legend-${entry.month}-${index}`}>
              <LegendColor color={colors[index % colors.length]} />
              <span>{entry.month} ({entry.success_rate}%)</span>
            </LegendItem>
          ))}
        </LegendContainer>
      )}
    </ChartContainer>
  );
};

export default MonthlyProgressChart;
