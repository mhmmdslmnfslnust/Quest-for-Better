import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Brain,
  Shield
} from 'lucide-react';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: var(--background-gradient);
  color: var(--color-text-primary);
  overflow-x: hidden;
`;

const Header = styled.header`
  padding: 20px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;

  .emoji {
    font-size: 32px;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.primary {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
  }
`;

const Hero = styled.section`
  padding: 120px 24px 80px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  
  .gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 24px;
  margin-bottom: 48px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Features = styled.section`
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 64px;
  
  .gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: white;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  p {
    opacity: 0.8;
    line-height: 1.6;
  }
`;

const GameFeatures = styled.section`
  padding: 80px 24px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const GameGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  
  .emoji {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const CTA = styled.section`
  padding: 80px 24px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  
  .gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CTASubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 48px;
  opacity: 0.9;
  line-height: 1.5;
`;

const Footer = styled.footer`
  padding: 40px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  text-align: center;
  
  p {
    opacity: 0.7;
    margin-bottom: 16px;
  }
  
  .links {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    
    a {
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
      
      &:hover {
        color: var(--color-primary);
      }
    }
  }
`;

const features = [
  {
    icon: Target,
    title: 'Smart Habit Tracking',
    description: 'Track both habits you want to build and habits you want to break with intuitive daily logging and streak tracking.'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Unlock badges, earn points, and level up your wellness warrior as you hit milestones and complete challenges.'
  },
  {
    icon: Zap,
    title: 'Daily Challenges',
    description: 'Take on time-limited challenges to boost your progress and earn bonus rewards while staying motivated.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your journey with detailed charts, statistics, and insights to understand your habit patterns.'
  },
  {
    icon: Users,
    title: 'Social Features',
    description: 'Connect with friends, share achievements, and compete on leaderboards to stay accountable and motivated.'
  },
  {
    icon: Star,
    title: 'Gamified Experience',
    description: 'Turn wellness into an adventure with points, levels, themed battles against "addiction monsters," and unlockable content.'
  }
];

const gameFeatures = [
  { emoji: '🎯', title: 'Daily Quests', description: 'Complete your habits to finish daily quests' },
  { emoji: '⚔️', title: 'Battle Monsters', description: 'Fight addiction monsters with good habits' },
  { emoji: '🏆', title: 'Collect Badges', description: 'Earn achievements for major milestones' },
  { emoji: '📈', title: 'Level Up', description: 'Gain XP and level up your character' },
  { emoji: '🔥', title: 'Streak Power', description: 'Build streaks for bonus multipliers' },
  { emoji: '🎁', title: 'Unlock Rewards', description: 'Unlock new themes and content' }
];

const LandingPage = () => {
  return (
    <LandingContainer>
      <Header>
        <Nav>
          <Logo to="/">
            <span className="emoji">🎯</span>
            HabitQuest
          </Logo>
          <NavButtons>
            <Button to="/login" className="secondary">
              Login
            </Button>
            <Button to="/register" className="primary">
              Start Your Quest
              <ArrowRight size={16} />
            </Button>
          </NavButtons>
        </Nav>
      </Header>

      <Hero>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Turn Your <span className="gradient">Habits</span><br />
          Into An Adventure
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build good habits, break bad ones, and level up your life with 
          the most engaging wellness app you'll ever use.
        </HeroSubtitle>
        
        <HeroButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button to="/register" className="primary">
            Start Your Quest
            <ArrowRight size={20} />
          </Button>
          <Button to="/login" className="secondary">
            Continue Journey
          </Button>
        </HeroButtons>
      </Hero>

      <Features>
        <SectionTitle>
          Why Choose <span className="gradient">HabitQuest</span>?
        </SectionTitle>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <feature.icon size={32} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Features>

      <GameFeatures>
        <SectionTitle>
          <span className="gradient">Game Elements</span> That Keep You Engaged
        </SectionTitle>
        
        <GameGrid>
          {gameFeatures.map((game, index) => (
            <GameCard
              key={game.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="emoji">{game.emoji}</span>
              <h4>{game.title}</h4>
              <p>{game.description}</p>
            </GameCard>
          ))}
        </GameGrid>
      </GameFeatures>

      <CTA>
        <CTATitle>
          Ready to <span className="gradient">Level Up</span> Your Life?
        </CTATitle>
        <CTASubtitle>
          Join thousands of users who have transformed their habits into achievements. 
          Your wellness adventure starts with a single click.
        </CTASubtitle>
        <Button to="/register" className="primary">
          Begin Your Quest
          <ArrowRight size={20} />
        </Button>
      </CTA>

      <Footer>
        <p>© 2024 HabitQuest. Turning wellness into an adventure.</p>
        <div className="links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Support</a>
          <a href="#about">About</a>
        </div>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
