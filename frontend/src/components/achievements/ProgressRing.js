import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: ${props => props.$strokeWidth};
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: ${props => props.$strokeWidth};
  stroke-linecap: round;
  stroke-dasharray: ${props => props.$circumference};
  stroke-dashoffset: ${props => props.$offset};
  transition: stroke-dashoffset 0.5s ease-in-out;
  filter: drop-shadow(0 0 6px ${props => props.$color}40);
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const Percentage = styled.div`
  font-size: ${props => props.$size > 80 ? '18px' : '14px'};
  color: var(--color-text-primary);
  line-height: 1;
`;

const Label = styled.div`
  font-size: ${props => props.$size > 80 ? '12px' : '10px'};
  color: var(--color-text-secondary);
  margin-top: 2px;
`;

const ProgressRing = ({ 
  current, 
  target, 
  size = 80, 
  strokeWidth = 6, 
  color = '#6366f1',
  showLabel = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((current / target) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Container $size={size}>
      <SVG>
        <CircleBackground
          cx={size / 2}
          cy={size / 2}
          r={radius}
          $strokeWidth={strokeWidth}
        />
        <CircleProgress
          cx={size / 2}
          cy={size / 2}
          r={radius}
          $strokeWidth={strokeWidth}
          $circumference={circumference}
          $offset={offset}
          $color={color}
        />
      </SVG>
      <Content>
        <Percentage $size={size}>
          {Math.round(percentage)}%
        </Percentage>
        {showLabel && (
          <Label $size={size}>
            {current}/{target}
          </Label>
        )}
      </Content>
    </Container>
  );
};

export default ProgressRing;
