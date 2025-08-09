import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Trophy, Zap, CheckCircle } from 'lucide-react';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: var(--color-text-primary);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  min-width: 300px;
  
  ${css`
    animation: ${slideIn} 0.3s ease;
  `}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--color-text-primary);
`;

const Message = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

const PointsHighlight = styled.span`
  color: #22c55e;
  font-weight: 600;
`;

export const ChallengeToast = ({ type, title, message, points }) => {
  const getIcon = () => {
    switch (type) {
      case 'joined':
        return { icon: Zap, color: '#3b82f6' };
      case 'completed':
        return { icon: Trophy, color: '#22c55e' };
      case 'progress':
        return { icon: CheckCircle, color: '#059669' };
      default:
        return { icon: Zap, color: '#6b7280' };
    }
  };

  const { icon: Icon, color } = getIcon();

  return (
    <ToastContainer>
      <IconContainer $color={color}>
        <Icon size={20} />
      </IconContainer>
      
      <Content>
        <Title>{title}</Title>
        <Message>
          {message}
          {points && (
            <>
              {' '}
              <PointsHighlight>+{points} points!</PointsHighlight>
            </>
          )}
        </Message>
      </Content>
    </ToastContainer>
  );
};

// Helper functions for common toast types
export const showChallengeJoinedToast = (challengeName) => {
  return (
    <ChallengeToast
      type="joined"
      title="Challenge Joined!"
      message={`Successfully joined "${challengeName}". Good luck!`}
    />
  );
};

export const showChallengeCompletedToast = (challengeName, points) => {
  return (
    <ChallengeToast
      type="completed"
      title="Challenge Completed! 🎉"
      message={`Congratulations on completing "${challengeName}"!`}
      points={points}
    />
  );
};

export const showProgressUpdatedToast = (challengeName) => {
  return (
    <ChallengeToast
      type="progress"
      title="Progress Updated"
      message={`Your progress in "${challengeName}" has been updated.`}
    />
  );
};

export default ChallengeToast;
