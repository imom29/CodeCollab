// Layout system types and interfaces

export interface PanelState {
  visible: boolean;
  size: number;
  collapsed: boolean;
}

export interface SplitViewState {
  enabled: boolean;
  ratio: number;
  leftFile?: string;
  rightFile?: string;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  largeDesktop: number;
}

export interface LayoutState {
  splitView: SplitViewState;
  panels: {
    fileExplorer: PanelState;
    chat: PanelState;
    terminal: PanelState;
  };
  minimap: {
    enabled: boolean;
    position: 'left' | 'right';
  };
  theme: string;
  breakpoints: ResponsiveBreakpoints;
  currentBreakpoint: keyof ResponsiveBreakpoints;
}

export interface LayoutActions {
  // Split view actions
  toggleSplitView: () => void;
  setSplitRatio: (ratio: number) => void;
  setSplitFiles: (leftFile?: string, rightFile?: string) => void;
  
  // Panel actions
  togglePanel: (panel: keyof LayoutState['panels']) => void;
  setPanelSize: (panel: keyof LayoutState['panels'], size: number) => void;
  collapsePanel: (panel: keyof LayoutState['panels']) => void;
  expandPanel: (panel: keyof LayoutState['panels']) => void;
  
  // Minimap actions
  toggleMinimap: () => void;
  setMinimapPosition: (position: 'left' | 'right') => void;
  
  // Theme actions
  setTheme: (theme: string) => void;
  
  // Layout reset
  resetLayout: () => void;
  
  // Breakpoint actions
  setCurrentBreakpoint: (breakpoint: keyof ResponsiveBreakpoints) => void;
}

export interface LayoutContextType extends LayoutState, LayoutActions {}

// Default layout configuration
export const DEFAULT_LAYOUT_STATE: LayoutState = {
  splitView: {
    enabled: false,
    ratio: 0.5,
    leftFile: undefined,
    rightFile: undefined,
  },
  panels: {
    fileExplorer: {
      visible: true,
      size: 250,
      collapsed: false,
    },
    chat: {
      visible: true,
      size: 300,
      collapsed: false,
    },
    terminal: {
      visible: false,
      size: 200,
      collapsed: false,
    },
  },
  minimap: {
    enabled: false,
    position: 'right',
  },
  theme: 'dark',
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    largeDesktop: 1440,
  },
  currentBreakpoint: 'desktop',
};

// Local storage key for persisting layout state
export const LAYOUT_STORAGE_KEY = 'layout-preferences';