import React, { useState } from 'react';
import styled from 'styled-components';
import { Check, X, Clock, Zap } from 'lucide-react';

const TrackingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const StatusDisplay = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => {
    if (props.$status === 'completed') return '#22c55e';
    if (props.$status === 'failed') return '#ef4444';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  color: white;
`;

const TrackingButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const TrackButton = styled.button`
  background: ${props => {
    if (props.variant === 'success') return '#22c55e';
    if (props.variant === 'failure') return '#ef4444';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.variant === 'success') return '#16a34a';
    if (props.variant === 'failure') return '#dc2626';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  min-width: 80px;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => {
      if (props.variant === 'success') return '#16a34a';
      if (props.variant === 'failure') return '#dc2626';
      return 'rgba(255, 255, 255, 0.2)';
    }};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PointsEarned = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fbbf24;
  font-size: 12px;
  font-weight: 600;
`;

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const HabitTrackingButton = ({ 
  habit, 
  todayLog, 
  onTrack, 
  loading = false 
}) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async (success) => {
    if (isTracking || loading) return;
    
    try {
      setIsTracking(true);
      await onTrack(habit.id, success);
    } catch (error) {
      console.error('Tracking error:', error);
    } finally {
      setIsTracking(false);
    }
  };

  // If already tracked today, show status
  if (todayLog) {
    return (
      <TrackingContainer>
        <StatusDisplay>
          <StatusIcon $status={todayLog.success ? 'completed' : 'failed'}>
            {todayLog.success ? <Check size={12} /> : <X size={12} />}
          </StatusIcon>
          <span>
            {todayLog.success ? 'Completed' : 'Not completed'} at {formatTime(todayLog.logged_at)}
          </span>
          {todayLog.success && todayLog.points_earned && (
            <PointsEarned>
              <Zap size={12} />
              +{todayLog.points_earned}
            </PointsEarned>
          )}
        </StatusDisplay>
      </TrackingContainer>
    );
  }

  // Show tracking buttons if not tracked yet
  return (
    <TrackingContainer>
      <StatusDisplay>
        <StatusIcon $status="pending">
          <Clock size={12} />
        </StatusIcon>
        <span>Track today's progress</span>
      </StatusDisplay>
      
      <TrackingButtons>
        <TrackButton
          variant="success"
          onClick={() => handleTrack(true)}
          disabled={isTracking || loading}
          title={`Mark as completed (+${habit.points_per_success} points)`}
        >
          <Check size={14} />
          Done
        </TrackButton>
        <TrackButton
          variant="failure"
          onClick={() => handleTrack(false)}
          disabled={isTracking || loading}
          title="Mark as not completed"
        >
          <X size={14} />
          Skip
        </TrackButton>
      </TrackingButtons>
    </TrackingContainer>
  );
};

export default HabitTrackingButton;
