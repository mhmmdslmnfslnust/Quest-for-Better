import React from 'react';
import styled from 'styled-components';
import { User, Settings, Palette, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  color: var(--color-text-primary);

  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      color: white;
    }
    
    .info {
      flex: 1;
      
      h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      
      .stats {
        display: flex;
        gap: 24px;
        
        .stat {
          text-align: center;
          
          .number {
            font-size: 18px;
            font-weight: 700;
            color: var(--color-primary);
          }
          
          .label {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
          }
        }
      }
    }
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: var(--color-text-primary);

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const ThemeOption = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${props => props.active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.background};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }
  
  .name {
    font-size: 14px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const ComingSoon = styled.div`
  padding: 32px;
  text-align: center;
  color: var(--color-text-secondary);
  
  p {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const ProfilePage = () => {
  const { user } = useAuth();
  const { currentTheme, changeTheme } = useTheme();

  return (
    <PageContainer>
      <Title>
        <User size={32} />
        Profile Settings
      </Title>

      <ProfileCard>
        <div className="profile-header">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="info">
            <h2>{user?.username}</h2>
            <div className="stats">
              <div className="stat">
                <div className="number">{user?.level || 1}</div>
                <div className="label">Level</div>
              </div>
              <div className="stat">
                <div className="number">{user?.total_points || 0}</div>
                <div className="label">Points</div>
              </div>
              <div className="stat">
                <div className="number">{user?.current_streak || 0}</div>
                <div className="label">Streak</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <strong>Email:</strong> {user?.email}
        </div>
      </ProfileCard>

      <Section>
        <h3>
          <Palette size={20} />
          Theme Preferences
        </h3>
        <ThemeGrid>
          {Object.entries(themes).map(([key, theme]) => (
            <ThemeOption
              key={key}
              active={currentTheme === key}
              background={theme.background}
              onClick={() => changeTheme(key)}
            >
              <div className="name">{theme.name}</div>
            </ThemeOption>
          ))}
        </ThemeGrid>
      </Section>

      <Section>
        <h3>
          <Settings size={20} />
          Account Settings
        </h3>
        <ComingSoon>
          <p>Account management features coming soon!</p>
        </ComingSoon>
      </Section>

      <Section>
        <h3>
          <Shield size={20} />
          Privacy & Security
        </h3>
        <ComingSoon>
          <p>Privacy and security settings coming soon!</p>
        </ComingSoon>
      </Section>
    </PageContainer>
  );
};

export default ProfilePage;
