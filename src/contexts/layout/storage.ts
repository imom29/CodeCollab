import { LayoutState, DEFAULT_LAYOUT_STATE, LAYOUT_STORAGE_KEY } from './types';

/**
 * Loads layout state from localStorage
 * Returns default state if no saved state exists or if parsing fails
 */
export const loadLayoutState = (): LayoutState => {
  try {
    const savedState = localStorage.getItem(LAYOUT_STORAGE_KEY);
    
    if (!savedState) {
      return DEFAULT_LAYOUT_STATE;
    }
    
    const parsedState = JSON.parse(savedState);
    
    // Merge with default state to ensure all properties exist
    // This handles cases where new properties are added to the layout state
    return {
      ...DEFAULT_LAYOUT_STATE,
      ...parsedState,
      panels: {
        ...DEFAULT_LAYOUT_STATE.panels,
        ...parsedState.panels,
      },
      splitView: {
        ...DEFAULT_LAYOUT_STATE.splitView,
        ...parsedState.splitView,
      },
      minimap: {
        ...DEFAULT_LAYOUT_STATE.minimap,
        ...parsedState.minimap,
      },
      breakpoints: {
        ...DEFAULT_LAYOUT_STATE.breakpoints,
        ...parsedState.breakpoints,
      },
    };
  } catch (error) {
    console.warn('Failed to load layout state from localStorage:', error);
    return DEFAULT_LAYOUT_STATE;
  }
};

/**
 * Saves layout state to localStorage
 */
export const saveLayoutState = (state: LayoutState): void => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save layout state to localStorage:', error);
  }
};

/**
 * Clears layout state from localStorage
 */
export const clearLayoutState = (): void => {
  try {
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear layout state from localStorage:', error);
  }
};