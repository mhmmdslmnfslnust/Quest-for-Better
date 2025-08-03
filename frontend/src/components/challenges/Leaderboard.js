import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Users, Target, Calendar, Zap } from 'lucide-react';

const podiumGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const PodiumSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const PodiumPlace = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  
  ${props => props.$position === 1 && css`
    order: 2;
    animation: ${podiumGlow} 3s ease-in-out infinite;
  `}
  
  ${props => props.$position === 2 && css`order: 1;`}
  ${props => props.$position === 3 && css`order: 3;`}
`;

const PodiumCard = styled.div`
  background: ${props => {
    if (props.$position === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (props.$position === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)';
    if (props.$position === 3) return 'linear-gradient(135deg, #cd7f32, #d4941e)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.$position <= 3 ? '#000' : 'var(--color-text-primary)'};
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  margin-bottom: 8px;
  min-width: 100px;
  border: 2px solid ${props => {
    if (props.$position === 1) return 'rgba(255, 215, 0, 0.5)';
    if (props.$position === 2) return 'rgba(192, 192, 192, 0.5)';
    if (props.$position === 3) return 'rgba(205, 127, 50, 0.5)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
`;

const PodiumIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const PodiumUsername = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  word-break: break-word;
`;

const PodiumProgress = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const PodiumBase = styled.div`
  width: 100px;
  height: ${props => {
    if (props.$position === 1) return '60px';
    if (props.$position === 2) return '40px';
    if (props.$position === 3) return '30px';
    return '20px';
  }};
  background: ${props => {
    if (props.$position === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (props.$position === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)';
    if (props.$position === 3) return 'linear-gradient(135deg, #cd7f32, #d4941e)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 8px 8px 0 0;
  border: 2px solid ${props => {
    if (props.$position === 1) return 'rgba(255, 215, 0, 0.5)';
    if (props.$position === 2) return 'rgba(192, 192, 192, 0.5)';
    if (props.$position === 3) return 'rgba(205, 127, 50, 0.5)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.$position <= 3 ? '#000' : 'var(--color-text-primary)'};
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    if (props.$rank <= 3) return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  min-width: 40px;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Username = styled.div`
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  word-break: break-word;
`;

const Progress = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  max-width: 100px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.$status === 'completed') return 'linear-gradient(90deg, #22c55e, #16a34a)';
    return 'linear-gradient(90deg, #3b82f6, #1d4ed8)';
  }};
  width: ${props => Math.min(100, Math.max(0, props.$progress || 0))}%;
  transition: width 0.3s ease;
`;

const StatusBadge = styled.div`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    if (props.$status === 'completed') return 'rgba(34, 197, 94, 0.2)';
    if (props.$status === 'active') return 'rgba(59, 130, 246, 0.2)';
    return 'rgba(156, 163, 175, 0.2)';
  }};
  color: ${props => {
    if (props.$status === 'completed') return '#22c55e';
    if (props.$status === 'active') return '#3b82f6';
    return '#9ca3af';
  }};
  border: 1px solid ${props => {
    if (props.$status === 'completed') return 'rgba(34, 197, 94, 0.3)';
    if (props.$status === 'active') return 'rgba(59, 130, 246, 0.3)';
    return 'rgba(156, 163, 175, 0.3)';
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--color-text-secondary);
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--color-text-primary);
  }
  
  p {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Leaderboard = ({ 
  challengeId, 
  challengeName,
  challengeTargetValue,
  leaderboardData = [], 
  stats = {},
  onRefresh,
  loading = false 
}) => {
  const [data, setData] = useState(leaderboardData);

  useEffect(() => {
    setData(leaderboardData);
  }, [leaderboardData]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown size={20} />;
      case 2: return <Medal size={20} />;
      case 3: return <Award size={20} />;
      default: return rank;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <Trophy size={14} />;
      case 'active': return <Zap size={14} />;
      default: return <Users size={14} />;
    }
  };

  const topThree = data.slice(0, 3);
  const remaining = data.slice(3);

  return (
    <Container>
      <Header>
        <Title>
          <Trophy size={20} />
          {challengeName ? `${challengeName} Leaderboard` : 'Challenge Leaderboard'}
        </Title>
      </Header>

      {stats && Object.keys(stats).length > 0 && (
        <StatsGrid>
          <StatItem>
            <StatValue>{stats.total_participants || 0}</StatValue>
            <StatLabel>
              <Users size={12} />
              Participants
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{stats.completed_count || 0}</StatValue>
            <StatLabel>
              <Trophy size={12} />
              Completed
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{stats.active_count || 0}</StatValue>
            <StatLabel>
              <Zap size={12} />
              Active
            </StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{Math.round(stats.average_progress || 0)}</StatValue>
            <StatLabel>
              <Target size={12} />
              Avg Progress
            </StatLabel>
          </StatItem>
        </StatsGrid>
      )}

      {data.length === 0 ? (
        <EmptyState>
          <div className="icon">🏆</div>
          <h4>No participants yet</h4>
          <p>Be the first to join this challenge and claim the top spot!</p>
        </EmptyState>
      ) : (
        <>
          {topThree.length > 0 && (
            <PodiumSection>
              {topThree.map((participant, index) => {
                const position = index + 1;
                return (
                  <PodiumPlace
                    key={participant.username}
                    $position={position}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PodiumCard $position={position}>
                      <PodiumIcon>{getRankIcon(position)}</PodiumIcon>
                      <PodiumUsername>{participant.username}</PodiumUsername>
                      <PodiumProgress>
                        {participant.current_progress} / {participant.target_value || challengeTargetValue || 'Goal'}
                      </PodiumProgress>
                      {participant.progress_percentage && (
                        <PodiumProgress>
                          {Math.round(participant.progress_percentage)}% complete
                        </PodiumProgress>
                      )}
                    </PodiumCard>
                    <PodiumBase $position={position}>
                      #{position}
                    </PodiumBase>
                  </PodiumPlace>
                );
              })}
            </PodiumSection>
          )}

          {remaining.length > 0 && (
            <LeaderboardList>
              {remaining.map((participant, index) => {
                const rank = index + 4; // Since we already showed top 3
                return (
                  <LeaderboardItem
                    key={participant.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 3) * 0.05 }}
                  >
                    <Rank $rank={rank}>
                      {rank}
                    </Rank>
                    
                    <UserInfo>
                      <Username>{participant.username}</Username>
                      <Progress>
                        <span>{participant.current_progress}</span>
                        <ProgressBar>
                          <ProgressFill 
                            $progress={participant.progress_percentage || 0}
                            $status={participant.status}
                          />
                        </ProgressBar>
                        <span>{Math.round(participant.progress_percentage || 0)}%</span>
                      </Progress>
                    </UserInfo>
                    
                    <StatusBadge $status={participant.status}>
                      {getStatusIcon(participant.status)}
                      {participant.status}
                    </StatusBadge>
                  </LeaderboardItem>
                );
              })}
            </LeaderboardList>
          )}
        </>
      )}
    </Container>
  );
};

export default Leaderboard;
