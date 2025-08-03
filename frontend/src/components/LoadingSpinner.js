import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--background-gradient);
  color: var(--color-text-primary);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-size: 18px;
  font-weight: 500;
  opacity: 0.8;
  text-align: center;
`;

const LoadingSpinner = ({ message = "Loading your wellness journey..." }) => {
  return (
    <Container>
      <Spinner />
      <Text>{message}</Text>
    </Container>
  );
};

export default LoadingSpinner;
