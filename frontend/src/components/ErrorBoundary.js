import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  background: rgba(var(--color-surface-rgb), 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  margin: 24px;
  min-height: 400px;

  .error-icon {
    width: 64px;
    height: 64px;
    color: #ef4444;
    margin-bottom: 24px;
  }

  h2 {
    color: var(--color-text-primary);
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 700;
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 32px;
    max-width: 500px;
    line-height: 1.6;
  }

  .error-details {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    padding: 16px;
    margin: 16px 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: var(--color-text-secondary);
    max-width: 600px;
    overflow-x: auto;
  }
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--color-accent-rgb), 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Optionally refresh the page
    if (this.props.refreshOnRetry) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <AlertTriangle className="error-icon" />
          <h2>Something went wrong</h2>
          <p>
            {this.props.fallbackMessage || 
             "An unexpected error occurred while rendering this component. This might be due to invalid data or a temporary issue."}
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="error-details">
              <strong>Error:</strong> {this.state.error.toString()}
              <br />
              <strong>Stack:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', marginTop: '8px' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          
          <RetryButton onClick={this.handleRetry}>
            <RefreshCw size={16} />
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
