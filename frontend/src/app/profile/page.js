'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Camera,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useTheme } from '../../lib/ThemeContext';
import Layout from '../../components/Layout';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 16px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;

  .avatar-container {
    position: relative;
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: 600;
    }

    .avatar-upload {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      border: 2px solid var(--color-background);
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .user-info {
    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .email {
      color: var(--color-text-secondary);
      margin-bottom: 8px;
    }

    .joined {
      font-size: 12px;
      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text);
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.6;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .toggle-info {
    .label {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .description {
      font-size: 12px;
      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }

  .toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: ${props => props.$active ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)'};
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &::after {
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 2px;
      left: ${props => props.$active ? '22px' : '2px'};
      transition: all 0.2s ease;
    }
  }
`;

const ThemeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;

  .theme-option {
    padding: 16px;
    border: 2px solid ${props => props.$active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'};
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.02);

    &:hover {
      border-color: var(--color-primary);
    }

    .theme-preview {
      width: 40px;
      height: 24px;
      border-radius: 6px;
      margin: 0 auto 8px;
      background: ${props => props.$gradient};
    }

    .theme-name {
      font-size: 12px;
      font-weight: 500;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &.primary {
      background: var(--color-primary);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }

    &.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    &.danger {
      background: var(--color-danger);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
    }
  }
`;

const DangerZone = styled(motion.div)`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;

  h4 {
    color: var(--color-danger);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }
`;

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    habitReminders: true,
    soundEffects: true,
    autoSync: true
  });

  const themes = [
    { name: 'Dark', value: 'dark', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { name: 'Light', value: 'light', gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' },
    { name: 'Auto', value: 'auto', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  ];

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <ProfileContainer>
        <Header>
          <h1>Profile & Settings</h1>
          <p className="subtitle">
            Manage your account settings and preferences
          </p>
        </Header>

        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AvatarSection>
            <div className="avatar-container">
              <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="avatar-upload">
                <Camera size={14} />
              </div>
            </div>
            <div className="user-info">
              <h2>{user?.name || 'User Name'}</h2>
              <div className="email">{user?.email || 'user@example.com'}</div>
              <div className="joined">Joined December 2023</div>
            </div>
          </AvatarSection>

          <SettingsSection>
            <h3><User size={20} /> Personal Information</h3>
            <FormGroup>
              <label>Full Name</label>
              <input type="text" defaultValue={user?.name || ''} placeholder="Enter your full name" />
            </FormGroup>
            <FormGroup>
              <label>Email Address</label>
              <input type="email" defaultValue={user?.email || ''} placeholder="Enter your email" />
            </FormGroup>
            <FormGroup>
              <label>Bio</label>
              <textarea placeholder="Tell us about yourself and your wellness journey..." />
            </FormGroup>
          </SettingsSection>

          <SettingsSection>
            <h3><Palette size={20} /> Appearance</h3>
            <FormGroup>
              <label>Theme</label>
              <ThemeSelector>
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.value}
                    className="theme-option"
                    $active={theme === themeOption.value}
                    $gradient={themeOption.gradient}
                    onClick={() => setTheme(themeOption.value)}
                  >
                    <div className="theme-preview" $gradient={themeOption.gradient} />
                    <div className="theme-name">{themeOption.name}</div>
                  </div>
                ))}
              </ThemeSelector>
            </FormGroup>
          </SettingsSection>

          <SettingsSection>
            <h3><Bell size={20} /> Notifications</h3>
            
            <ToggleSwitch $active={settings.emailNotifications}>
              <div className="toggle-info">
                <div className="label">Email Notifications</div>
                <div className="description">Receive updates about your habits and achievements</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('emailNotifications')} />
            </ToggleSwitch>

            <ToggleSwitch $active={settings.pushNotifications}>
              <div className="toggle-info">
                <div className="label">Push Notifications</div>
                <div className="description">Get real-time notifications in your browser</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('pushNotifications')} />
            </ToggleSwitch>

            <ToggleSwitch $active={settings.weeklyDigest}>
              <div className="toggle-info">
                <div className="label">Weekly Digest</div>
                <div className="description">Weekly summary of your progress and insights</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('weeklyDigest')} />
            </ToggleSwitch>

            <ToggleSwitch $active={settings.habitReminders}>
              <div className="toggle-info">
                <div className="label">Habit Reminders</div>
                <div className="description">Daily reminders for your scheduled habits</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('habitReminders')} />
            </ToggleSwitch>
          </SettingsSection>

          <SettingsSection>
            <h3><Settings size={20} /> General</h3>
            
            <ToggleSwitch $active={settings.soundEffects}>
              <div className="toggle-info">
                <div className="label">Sound Effects</div>
                <div className="description">Play sounds for achievements and interactions</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('soundEffects')} />
            </ToggleSwitch>

            <ToggleSwitch $active={settings.autoSync}>
              <div className="toggle-info">
                <div className="label">Auto Sync</div>
                <div className="description">Automatically sync data across devices</div>
              </div>
              <div className="toggle" onClick={() => toggleSetting('autoSync')} />
            </ToggleSwitch>
          </SettingsSection>

          <ButtonGroup>
            <button className="btn primary">
              <Save size={16} />
              Save Changes
            </button>
            <button className="btn secondary">
              <Download size={16} />
              Export Data
            </button>
            <button className="btn secondary">
              <X size={16} />
              Cancel
            </button>
          </ButtonGroup>
        </ProfileCard>

        <DangerZone
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4><Shield size={18} /> Danger Zone</h4>
          <p>
            Once you delete your account, there is no going back. This action cannot be undone and will 
            permanently remove all your data, habits, achievements, and progress.
          </p>
          <button className="btn danger">
            <Trash2 size={16} />
            Delete Account
          </button>
        </DangerZone>
      </ProfileContainer>
    </Layout>
  );
}
