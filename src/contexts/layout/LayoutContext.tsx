import React, { createContext, useContext } from 'react';
import { LayoutContextType } from './types';

// Create the Layout Context
export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Custom hook to use the Layout Context
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  
  return context;
};