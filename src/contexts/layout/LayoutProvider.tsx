import React, { useCallback, useEffect, useReducer, ReactNode } from 'react';
import { LayoutContext } from './LayoutContext';
import { 
  LayoutState, 
  LayoutActions, 
  DEFAULT_LAYOUT_STATE,
  ResponsiveBreakpoints 
} from './types';
import { loadLayoutState, saveLayoutState } from './storage';

// Action types for the layout reducer
type LayoutAction =
  | { type: 'TOGGLE_SPLIT_VIEW' }
  | { type: 'SET_SPLIT_RATIO'; payload: number }
  | { type: 'SET_SPLIT_FILES'; payload: { leftFile?: string; rightFile?: string } }
  | { type: 'TOGGLE_PANEL'; payload: keyof LayoutState['panels'] }
  | { type: 'SET_PANEL_SIZE'; payload: { panel: keyof LayoutState['panels']; size: number } }
  | { type: 'COLLAPSE_PANEL'; payload: keyof LayoutState['panels'] }
  | { type: 'EXPAND_PANEL'; payload: keyof LayoutState['panels'] }
  | { type: 'TOGGLE_MINIMAP' }
  | { type: 'SET_MINIMAP_POSITION'; payload: 'left' | 'right' }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'RESET_LAYOUT' }
  | { type: 'SET_CURRENT_BREAKPOINT'; payload: keyof ResponsiveBreakpoints }
  | { type: 'LOAD_SAVED_STATE'; payload: LayoutState };

// Layout reducer function
const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case 'TOGGLE_SPLIT_VIEW':
      return {
        ...state,
        splitView: {
          ...state.splitView,
          enabled: !state.splitView.enabled,
        },
      };

    case 'SET_SPLIT_RATIO':
      return {
        ...state,
        splitView: {
          ...state.splitView,
          ratio: Math.max(0.1, Math.min(0.9, action.payload)), // Clamp between 0.1 and 0.9
        },
      };

    case 'SET_SPLIT_FILES':
      return {
        ...state,
        splitView: {
          ...state.splitView,
          leftFile: action.payload.leftFile,
          rightFile: action.payload.rightFile,
        },
      };

    case 'TOGGLE_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.payload]: {
            ...state.panels[action.payload],
            visible: !state.panels[action.payload].visible,
          },
        },
      };

    case 'SET_PANEL_SIZE':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.payload.panel]: {
            ...state.panels[action.payload.panel],
            size: Math.max(100, action.payload.size), // Minimum size of 100px
          },
        },
      };

    case 'COLLAPSE_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.payload]: {
            ...state.panels[action.payload],
            collapsed: true,
          },
        },
      };

    case 'EXPAND_PANEL':
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.payload]: {
            ...state.panels[action.payload],
            collapsed: false,
          },
        },
      };

    case 'TOGGLE_MINIMAP':
      return {
        ...state,
        minimap: {
          ...state.minimap,
          enabled: !state.minimap.enabled,
        },
      };

    case 'SET_MINIMAP_POSITION':
      return {
        ...state,
        minimap: {
          ...state.minimap,
          position: action.payload,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'RESET_LAYOUT':
      return DEFAULT_LAYOUT_STATE;

    case 'SET_CURRENT_BREAKPOINT':
      return {
        ...state,
        currentBreakpoint: action.payload,
      };

    case 'LOAD_SAVED_STATE':
      return action.payload;

    default:
      return state;
  }
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, DEFAULT_LAYOUT_STATE);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadLayoutState();
    dispatch({ type: 'LOAD_SAVED_STATE', payload: savedState });
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveLayoutState(state);
  }, [state]);

  // Responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let breakpoint: keyof ResponsiveBreakpoints = 'desktop';

      if (width < state.breakpoints.mobile) {
        breakpoint = 'mobile';
      } else if (width < state.breakpoi