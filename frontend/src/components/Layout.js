import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Settings,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LayoutContainer = styled.div`
          <UserInfo $width={sidebarWidth}>
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="info">
              <div className="name">{user?.username}</div>
              <div className="level">
                ⭐ Level {user?.level || 1} • {user?.total_points || 0} pts
              </div>
            </div>
          </UserInfo>flex;
  min-height: 100vh;
  background: var(--background-gradient);
  color: var(--color-text-primary);
`;

const Sidebar = styled(motion.aside)`
  width: ${props => props.$isCollapsed ? '0px' : `${props.$width}px`};
  min-width: ${props => props.$isCollapsed ? '0px' : `${props.$width}px`};
  max-width: ${props => props.$isCollapsed ? '0px' : `${props.$width}px`};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ${props => props.$isResizing && `
    transition: none;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
  `}

  @media (max-width: 768px) {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
  }
`;

const SidebarContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  opacity: ${props => props.$isCollapsed ? 0 : 1};
  visibility: ${props => props.$isCollapsed ? 'hidden' : 'visible'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  transition-delay: ${props => props.$isCollapsed ? '0s' : '0.1s'};
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: transparent;
  cursor: col-resize;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
    background: rgba(99, 102, 241, 0.1);
  }

  &:active {
    background: rgba(99, 102, 241, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 40px;
    background: var(--color-primary);
    border-radius: 1px;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const CollapseToggle = styled.button`
  position: fixed;
  top: 50%;
  left: ${props => props.$isCollapsed ? '12px' : `${props.$width - 12}px`};
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    display: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.$isCollapsed ? '0px' : `${props.$sidebarWidth}px`};
  padding: 24px;
  overflow-y: auto;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
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

const WidthIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10000;

  @media (max-width: 768px) {
    display: none;
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
  gap: ${props => props.$width < 260 ? '8px' : '12px'};
  padding: ${props => props.$width < 260 ? '12px' : '16px'};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .avatar {
    width: ${props => props.$width < 260 ? '36px' : '48px'};
    height: ${props => props.$width < 260 ? '36px' : '48px'};
    min-width: ${props => props.$width < 260 ? '36px' : '48px'};
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.$width < 260 ? '14px' : '18px'};
    font-weight: 600;
    color: white;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .info {
    flex: 1;
    min-width: 0; /* Allow text to shrink */
    
    .name {
      font-weight: 600;
      font-size: ${props => props.$width < 260 ? '14px' : '16px'};
      margin-bottom: ${props => props.$width < 260 ? '0px' : '4px'};
      transition: all 0.3s ease;
      cursor: pointer;
      line-height: 1.4;
      
      /* Truncated by default */
      ${props => !props.$nameExpanded && `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}
      
      /* Expanded state - multi-line */
      ${props => props.$nameExpanded && `
        white-space: normal;
        word-break: break-word;
        max-height: none;
      `}
    }
    
    .level {
      font-size: ${props => props.$width < 260 ? '12px' : '14px'};
      opacity: 0.8;
      display: ${props => props.$width < 260 ? 'none' : 'flex'};
      align-items: center;
      gap: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /* Click indicator */
  &::after {
    content: '${props => props.$nameExpanded ? '▼' : '▶'}';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    opacity: 0.5;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.$width < 260 ? '8px' : '12px'};
  padding: ${props => props.$width < 260 ? '10px 12px' : '12px 16px'};
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: ${props => props.$width < 260 ? '14px' : '16px'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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
    width: ${props => props.$width < 260 ? '18px' : '20px'};
    height: ${props => props.$width < 260 ? '18px' : '20px'};
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  gap: ${props => props.$width < 260 ? '8px' : '12px'};
  padding: ${props => props.$width < 260 ? '10px 12px' : '12px 16px'};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 8px;
  width: 100%;
  margin-top: 16px;
  transition: all 0.2s ease;
  font-size: ${props => props.$width < 260 ? '14px' : '16px'};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }

  svg {
    width: ${props => props.$width < 260 ? '18px' : '20px'};
    height: ${props => props.$width < 260 ? '18px' : '20px'};
    flex-shrink: 0;
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
  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile only
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [sidebarWidth, setSidebarWidth] = useState(280); // Desktop width
  const [isResizing, setIsResizing] = useState(false);
  const [showWidthIndicator, setShowWidthIndicator] = useState(false);
  const [nameExpanded, setNameExpanded] = useState(false); // Name expansion toggle
  
  // Refs for resize functionality
  const sidebarRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Width constraints
  const MIN_WIDTH = 220; // Increased from 200px for better UX
  const MAX_WIDTH = 350;
  const DEFAULT_WIDTH = 280;

  // Load saved preferences on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('habitquest_sidebar_collapsed');
    const savedWidth = localStorage.getItem('habitquest_sidebar_width');
    
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true);
    }
    
    if (savedWidth && !isNaN(parseInt(savedWidth))) {
      const width = parseInt(savedWidth);
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((collapsed, width) => {
    localStorage.setItem('habitquest_sidebar_collapsed', collapsed.toString());
    localStorage.setItem('habitquest_sidebar_width', width.toString());
  }, []);

  // Toggle sidebar collapse
  const toggleSidebarCollapse = useCallback(() => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    savePreferences(newCollapsed, sidebarWidth);
  }, [sidebarCollapsed, sidebarWidth, savePreferences]);

  // Resize handling
  const startResize = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    setShowWidthIndicator(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleResize = useCallback((e) => {
    if (!isResizing) return;
    
    // Calculate new width with proper constraints
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
    setSidebarWidth(newWidth);
    
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // Hide indicator after 1 second of no movement
    resizeTimeoutRef.current = setTimeout(() => {
      setShowWidthIndicator(false);
    }, 1000);
  }, [isResizing, MIN_WIDTH, MAX_WIDTH]);

  const stopResize = useCallback(() => {
    if (!isResizing) return;
    
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    savePreferences(sidebarCollapsed, sidebarWidth);
    
    // Hide indicator after a short delay
    setTimeout(() => {
      setShowWidthIndicator(false);
    }, 500);
  }, [isResizing, sidebarCollapsed, sidebarWidth, savePreferences]);

  // Event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, handleResize, stopResize]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);
  
  // Toggle name expansion
  const toggleNameExpansion = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setNameExpanded(!nameExpanded);
  };

  return (
    <LayoutContainer>
      {/* Width Indicator */}
      <WidthIndicator $isVisible={showWidthIndicator}>
        {sidebarWidth}px
      </WidthIndicator>

      {/* Collapse Toggle Button */}
      <CollapseToggle
        $isCollapsed={sidebarCollapsed}
        $width={sidebarWidth}
        onClick={toggleSidebarCollapse}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </CollapseToggle>

      {/* Mobile Header */}
      <MobileHeader>
        <Logo>
          <span className="emoji">🎯</span>
          <h1>HabitQuest</h1>
        </Logo>
        <MenuButton onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </MenuButton>
      </MobileHeader>

      {/* Mobile Sidebar Overlay */}
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

      {/* Main Sidebar */}
      <Sidebar
        ref={sidebarRef}
        $isOpen={sidebarOpen}
        $isCollapsed={sidebarCollapsed}
        $width={sidebarWidth}
        $isResizing={isResizing}
        initial={{ x: sidebarCollapsed ? -sidebarWidth : 0 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Resize Handle */}
        {!sidebarCollapsed && (
          <ResizeHandle
            onMouseDown={startResize}
            title="Drag to resize sidebar"
          />
        )}

        {/* Close Button (Mobile) */}
        <SidebarContent $isCollapsed={sidebarCollapsed}>
          <CloseButton onClick={closeSidebar}>
            <X size={20} />
          </CloseButton>

          <Logo>
            <span className="emoji">🎯</span>
            <h1>HabitQuest</h1>
          </Logo>

          <UserInfo $nameExpanded={nameExpanded} onClick={toggleNameExpansion}>
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
                  $width={sidebarWidth}
                >
                  <Icon />
                  <span>{item.name}</span>
                </NavItem>
              );
            })}
          </Nav>

          <LogoutButton onClick={handleLogout} $width={sidebarWidth}>
            <LogOut size={sidebarWidth < 260 ? 18 : 20} />
            Logout
          </LogoutButton>
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <MainContent 
        $isCollapsed={sidebarCollapsed}
        $sidebarWidth={sidebarWidth}
      >
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
