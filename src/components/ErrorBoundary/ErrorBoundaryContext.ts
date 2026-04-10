import React from 'react';

interface ErrorBoundaryContextType {
  forceError: (error: Error) => void;
}

export const ErrorBoundaryContext =
  React.createContext<ErrorBoundaryContextType>({
    forceError: () => {},
  });
