import React from 'react';
import styled from 'styled-components';
import { Trophy, Award, Lock, Target } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

// Hybrid Approach: Status Toggle + Category Filters
const StatusToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatusToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const StatusButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  ${props => props.$active ? `
    background: ${props.$type === 'earned' 
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : props.$type === 'locked'
      ? 'linear-gradient(135deg, #6b7280, #4b5563)'
      : props.$type === 'close'
      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
      : 'linear-gradient(135deg, #6366f1, #4f46e5)'
    };
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  ` : `
    background: transparent;
    color: var(--color-text-secondary);
  `}

  &:hover {
    background: ${props => props.$active ? props.background : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active 
    ? 'rgba(255, 255, 255, 0.25)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.$active 
    ? 'var(--color-text-primary)' 
    : 'var(--color-text-secondary)'
  };
  border: 1px solid ${props => props.$active 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(255, 255, 255, 0.15)'
  };
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.$active 
    ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Emoji = styled.span`
  font-size: 16px;
`;

const CategoryName = styled.span`
  text-transform: capitalize;
`;

const Count = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
`;

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  stats = {}
}) => {
  const statusFilters = [
    { 
      key: 'all', 
      label: 'All', 
      icon: Trophy, 
      count: stats.total || 0,
      type: 'all'
    },
    { 
      key: 'earned', 
      label: 'Earned', 
      icon: Award, 
      count: stats.earned || 0,
      type: 'earned'
    },
    { 
      key: 'locked', 
      label: 'Locked', 
      icon: Lock, 
      count: stats.locked || 0,
      type: 'locked'
    },
    { 
      key: 'close', 
      label: 'Almost There', 
      icon: Target, 
      count: stats.close || 0,
      type: 'close'
    }
  ];

  return (
    <Container>
      {/* Status Toggle - Hybrid approach */}
      <StatusToggleContainer>
        <StatusToggle>
          {statusFilters.map(({ key, label, icon: Icon, count, type }) => (
            <StatusButton
              key={key}
              $active={selectedStatus === key}
              $type={type}
              onClick={() => onStatusChange(key)}
            >
              <Icon size={16} />
              {label}
              {count > 0 && <span>({count})</span>}
            </StatusButton>
          ))}
        </StatusToggle>
      </StatusToggleContainer>

      {/* Category Filters - Traditional approach */}
      <CategoryFilters>
        {categories.map(category => (
          <FilterButton
            key={category.key}
            $active={selectedCategory === category.key}
            onClick={() => onCategoryChange(category.key)}
          >
            <Emoji>{category.emoji}</Emoji>
            <CategoryName>{category.name}</CategoryName>
            <Count>{category.count}</Count>
          </FilterButton>
        ))}
      </CategoryFilters>
    </Container>
  );
};

export default CategoryFilter;
