import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ScoreContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.$isExcellent && css`
    border: 2px solid var(--color-success);
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.1) 0%, 
      rgba(255, 255, 255, 0.1) 100%);
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(16, 185, 129, 0.1),
        transparent
      );
      animation: ${shimmer} 3s ease-in-out infinite;
    }
  `}
`;

const ScoreTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ScoreValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${props => 
    props.$score >= 90 ? 'var(--color-success)' :
    props.$score >= 70 ? 'var(--color-warning)' :
    props.$score >= 50 ? 'var(--color-info)' :
    'var(--color-error)'
  };
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
`;

const ScoreDescription = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const ProgressRing = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  position: relative;
  
  svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }
  
  .background {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 8;
  }
  
  .progress {
    fill: none;
    stroke: ${props => 
      props.$score >= 90 ? 'var(--color-success)' :
      props.$score >= 70 ? 'var(--color-warning)' :
      props.$score >= 50 ? 'var(--color-info)' :
      'var(--color-error)'
    };
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: ${props => {
      const circumference = 2 * Math.PI * 52;
      const progress = (props.$score / 100) * circumference;
      return `${progress} ${circumference}`;
    }};
    transition: stroke-dasharray 1s ease-in-out;
  }
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  position: relative;
  z-index: 1;
`;

const InsightItem = styled.div`
  font-size: 14px;
  color: var(--color-text-primary);
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: left;
`;

const WellnessScore = ({ score, insights = [] }) => {
  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You're crushing your wellness goals! 🌟";
    if (score >= 70) return "Great work! Your consistency is paying off! 🎯";
    if (score >= 50) return "Good progress! Keep building those healthy habits! 💪";
    return "Every journey starts with a single step. You've got this! 🌱";
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <ScoreContainer $isExcellent={score >= 90}>
      <ScoreTitle>
        🏆 Wellness Score
      </ScoreTitle>
      
      <ProgressRing $score={score}>
        <svg>
          <circle
            className="background"
            cx="60"
            cy="60"
            r={radius}
          />
          <circle
            className="progress"
            cx="60"
            cy="60"
            r={radius}
          />
        </svg>
      </ProgressRing>
      
      <ScoreValue $score={score}>
        {score}
      </ScoreValue>
      
      <ScoreDescription>
        {getScoreMessage(score)}
      </ScoreDescription>
      
      {insights.length > 0 && (
        <InsightsList>
          {insights.map((insight, index) => (
            <InsightItem key={index}>
              • {insight}
            </InsightItem>
          ))}
        </InsightsList>
      )}
    </ScoreContainer>
  );
};

export default WellnessScore;
