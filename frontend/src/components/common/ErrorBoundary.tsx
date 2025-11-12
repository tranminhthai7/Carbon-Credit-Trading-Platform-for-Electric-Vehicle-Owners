import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      // surface the error details in development for easier debugging
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const {
      title = 'Something went wrong',
      message = 'An unexpected error occurred. Please try again.',
      actionLabel = 'Try again',
    } = this.props;

    return (
      <Box
        role="alert"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={4}
        minHeight="60vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h5" component="h1" tabIndex={0}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        {this.state.error?.message && (
          <Typography variant="body2" color="text.secondary">
            {this.state.error.message}
          </Typography>
        )}
        <Button variant="contained" onClick={this.handleReset}>
          {actionLabel}
        </Button>
      </Box>
    );
  }
}

export default ErrorBoundary;

