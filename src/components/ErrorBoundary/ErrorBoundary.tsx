// src/components/ErrorBoundary/ErrorBoundary.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ErrorBoundaryContext } from './ErrorBoundaryContext';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('🔥 Error caught:', error);

    // send to service (Sentry / custom)
    // ErrorReporting.logErrorToMyService(error, errorInfo);
  }

  // 🔥 Force error manually (from anywhere)
  forceError = (error: Error) => {
    // ErrorReporting.logErrorToMyService(error);
    this.setState({ hasError: true, error });
  };

  // 🔁 Reset (retry)
  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong 🚨</Text>

          <Text style={styles.message}>
            {this.state.error?.message || 'Unexpected error'}
          </Text>

          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ErrorBoundaryContext.Provider value={{ forceError: this.forceError }}>
        {this.props.children}
      </ErrorBoundaryContext.Provider>
    );
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#385380',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
