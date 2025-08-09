import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { 
  Target, 
  Calendar, 
  Flame, 
  Trophy, 
  Edit3, 
  Trash2, 
  TrendingUp 
} from 'lucide-react';

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.$isHighlighted && `
    border-color: var(--color-primary);
    box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3);
    background: rgba(var(--color-primary-rgb), 0.05);
    animation: highlightPulse 0.6s ease-out;
    
    @keyframes highlightPulse {
      0% { box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3); }
      50% { box-shadow: 0 0 40px rgba(var(--color-primary-rgb), 0.6); }
      100% { box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3); }
    }
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    
    ${props => props.$isHighlighted && `
      box-shadow: 0 20px 40px rgba(var(--color-primary-rgb), 0.2);
    `}
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'var(--color-primary)'};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const HabitInfo = styled.div`
  flex: 1;
`;

const HabitIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

const HabitName = styled.h3`
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
`;

const HabitDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  opacity: 0.8;
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2;
    fill: none;
    transition: all 0.2s ease;
  }

  &[title*="Edit"] {
    svg {
      stroke: #3b82f6 !important;
      color: #3b82f6 !important;
    }
    
    &:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
      transform: scale(1.1);
      
      svg {
        stroke: #60a5fa !important;
        color: #60a5fa !important;
      }
    }
  }

  &[title*="Delete"] {
    svg {
      stroke: #ef4444 !important;
      color: #ef4444 !important;
    }
    
    &:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      transform: scale(1.1);
      
      svg {
        stroke: #f87171 !important;
        color: #f87171 !important;
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const TrackingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DifficultyIndicator = styled.div`
  display: flex;
  gap: 2px;
`;

const DifficultyDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$filled 
    ? (props.$color || 'var(--color-primary)') 
    : 'rgba(255, 255, 255, 0.3)'
  };
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 8px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.$color || 'var(--color-primary)'};
  width: ${props => props.$percentage}%;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const HabitCard = forwardRef(({ 
  habit, 
  stats,
  onEdit, 
  onDelete, 
  onTrack,
  isCompletedToday,
  isHighlighted = false,
  children 
}, ref) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return '#22c55e'; // Easy - Green
      case 2: return '#eab308'; // Medium - Yellow
      case 3: return '#f97316'; // Hard - Orange
      case 4: return '#ef4444'; // Very Hard - Red
      case 5: return '#8b5cf6'; // Expert - Purple
      default: return 'var(--color-primary)';
    }
  };

  const difficultyLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Very Hard',
    5: 'Expert'
  };

  const completionRate = stats?.completionRate || 0;
  const difficultyColor = getDifficultyColor(habit.difficulty);

  return (
    <CardContainer ref={ref} color={habit.color} $isHighlighted={isHighlighted}>
      <Header>
        <HabitInfo>
          <HabitIcon>{habit.icon}</HabitIcon>
          <HabitName>{habit.name}</HabitName>
          {habit.description && (
            <HabitDescription>{habit.description}</HabitDescription>
          )}
          <CategoryBadge>{habit.category}</CategoryBadge>
        </HabitInfo>
        <Actions>
          <ActionButton onClick={() => onEdit(habit)} title="Edit habit">
            <Edit3 size={14} />
          </ActionButton>
          <ActionButton onClick={() => onDelete(habit.id)} title="Delete habit">
            <Trash2 size={14} />
          </ActionButton>
        </Actions>
      </Header>

      <Stats>
        <StatItem>
          <StatValue>{stats?.currentStreak || 0}</StatValue>
          <StatLabel>
            <Flame size={12} />
            Streak
          </StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{completionRate}%</StatValue>
          <StatLabel>
            <TrendingUp size={12} />
            Success
          </StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats?.pointsEarned || 0}</StatValue>
          <StatLabel>
            <Trophy size={12} />
            Points
          </StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats?.totalLogs || 0}</StatValue>
          <StatLabel>
            <Calendar size={12} />
            Logs
          </StatLabel>
        </StatItem>
      </Stats>

      <div>
        <StatLabel style={{ marginBottom: '8px', justifyContent: 'flex-start' }}>
          <Target size={12} />
          Difficulty: {difficultyLabels[habit.difficulty]}
        </StatLabel>
        <DifficultyIndicator>
          {[1, 2, 3, 4, 5].map(level => (
            <DifficultyDot
              key={level}
              $filled={level <= habit.difficulty}
              $color={difficultyColor}
            />
          ))}
        </DifficultyIndicator>
      </div>

      <ProgressBar>
        <ProgressFill 
          $percentage={completionRate} 
          $color={habit.color}
        />
      </ProgressBar>

      <TrackingSection>
        {children}
      </TrackingSection>
    </CardContainer>
  );
});

HabitCard.displayName = 'HabitCard';

export default HabitCard;
