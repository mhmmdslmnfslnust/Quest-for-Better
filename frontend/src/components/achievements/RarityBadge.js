import React from 'react';
import styled from 'styled-components';

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$background};
  color: ${props => props.$color};
  border: 1px solid ${props => props.$borderColor};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Gem = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.$color};
  border-radius: 2px;
  transform: rotate(45deg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
`;

const RarityBadge = ({ rarity }) => {
  const getRarityConfig = (rarity) => {
    switch (rarity) {
      case 'common':
        return {
          background: 'rgba(156, 163, 175, 0.2)',
          color: '#6b7280',
          borderColor: 'rgba(156, 163, 175, 0.3)',
          gemColor: '#9ca3af',
          text: 'Common'
        };
      case 'rare':
        return {
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#3b82f6',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          gemColor: '#3b82f6',
          text: 'Rare'
        };
      case 'epic':
        return {
          background: 'rgba(147, 51, 234, 0.2)',
          color: '#9333ea',
          borderColor: 'rgba(147, 51, 234, 0.3)',
          gemColor: '#9333ea',
          text: 'Epic'
        };
      case 'legendary':
        return {
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          gemColor: '#f59e0b',
          text: 'Legendary'
        };
      default:
        return {
          background: 'rgba(156, 163, 175, 0.2)',
          color: '#6b7280',
          borderColor: 'rgba(156, 163, 175, 0.3)',
          gemColor: '#9ca3af',
          text: 'Common'
        };
    }
  };

  const config = getRarityConfig(rarity);

  return (
    <Badge
      $background={config.background}
      $color={config.color}
      $borderColor={config.borderColor}
    >
      <Gem $color={config.gemColor} />
      {config.text}
    </Badge>
  );
};

export default RarityBadge;
