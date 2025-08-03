import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  Trophy, 
  Zap, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--background-gradient);
  color: var(--color-text-primary);
`;

const Sidebar = styled(motion.aside)`
  width: 280px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-y: auto;

  @media (max-width: 768px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
  }
`;

const MobileSidebar = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
`;

const MobileHeader = styled.header`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .emoji {
    font-size: 32px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    color: white;
  }

  .info {
    flex: 1;
    
    .name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .level {
      font-size: 14px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const Nav = styled.nav`
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  margin-bottom: 4px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-primary);
    transform: translateX(4px);
  }

  &.active {
    background: rgba(99, 102, 241, 0.2);
    color: var(--color-primary);
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  padding: 8px;
  border-radius: 8px;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  padding: 8px;
  border-radius: 8px;
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 8px;
  width: 100%;
  margin-top: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }
`;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Challenges', href: '/challenges', icon: Zap },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <LayoutContainer>
      <MobileHeader>
        <Logo>
          <span className="emoji">🎯</span>
          <h1>HabitQuest</h1>
        </Logo>
        <MenuButton onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </MenuButton>
      </MobileHeader>

      <AnimatePresence>
        {sidebarOpen && (
          <MobileSidebar
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <Sidebar
        $isOpen={sidebarOpen}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <CloseButton onClick={closeSidebar}>
          <X size={20} />
        </CloseButton>

        <Logo>
          <span className="emoji">🎯</span>
          <h1>HabitQuest</h1>
        </Logo>

        <UserInfo>
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="info">
            <div className="name">{user?.username}</div>
            <div className="level">
              ⭐ Level {user?.level || 1} • {user?.total_points || 0} pts
            </div>
          </div>
        </UserInfo>

        <Nav>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
              >
                <Icon />
                {item.name}
              </NavItem>
            );
          })}
        </Nav>

        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
