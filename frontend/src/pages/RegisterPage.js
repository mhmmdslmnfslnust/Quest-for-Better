import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: var(--background-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--color-text-primary);
`;

const RegisterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-size: 16px;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &.error {
    border-color: var(--color-danger);
  }

  &.success {
    border-color: var(--color-accent);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 4px;
  
  .bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    transition: background-color 0.2s ease;
    
    &.weak { background-color: #ef4444; }
    &.medium { background-color: #f59e0b; }
    &.strong { background-color: #10b981; }
  }
`;

const PasswordHints = styled.ul`
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
  list-style: none;
  padding: 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    
    &.valid {
      color: var(--color-accent);
    }
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-danger);
  font-size: 14px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 32px 0;
  position: relative;
  color: var(--color-text-secondary);
  font-size: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 1;
  }

  span {
    background: var(--background-gradient);
    padding: 0 16px;
    position: relative;
    z-index: 2;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;

  a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-secondary);
    }
  }
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', check: (pwd) => pwd.length >= 6 },
    { text: 'One lowercase letter', check: (pwd) => /[a-z]/.test(pwd) },
    { text: 'One uppercase letter', check: (pwd) => /[A-Z]/.test(pwd) },
    { text: 'One number', check: (pwd) => /\d/.test(pwd) }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.message });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackButton to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackButton>

        <Header>
          <Title>Start Your Quest!</Title>
          <Subtitle>Create your account and begin your wellness adventure</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {errors.general && (
            <ErrorMessage>{errors.general}</ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              required
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputContainer>
            
            {formData.password && (
              <PasswordStrength>
                {[1, 2, 3, 4].map(level => (
                  <div 
                    key={level}
                    className={`bar ${
                      passwordStrength >= level 
                        ? passwordStrength <= 2 ? 'weak' 
                        : passwordStrength <= 3 ? 'medium' 
                        : 'strong' 
                        : ''
                    }`}
                  />
                ))}
              </PasswordStrength>
            )}
            
            {formData.password && (
              <PasswordHints>
                {passwordRequirements.map((req, index) => (
                  <li key={index} className={req.check(formData.password) ? 'valid' : ''}>
                    <CheckCircle size={12} />
                    {req.text}
                  </li>
                ))}
              </PasswordHints>
            )}
            
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputContainer>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : 
                          formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputContainer>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>Already have an account?</span>
        </Divider>

        <LoginPrompt>
          Ready to continue your quest?{' '}
          <Link to="/login">Sign in here</Link>
        </LoginPrompt>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
