import React, { useState, useCallback } from 'react';
import { DEBUG_MODE_DEV, DebugMode } from '@/types/app';

type ModeContext = {
  mode?: DebugMode;
  onModeChange: (mode: DebugMode) => void;
};

export const ModeContext = React.createContext<ModeContext>({
  mode: DEBUG_MODE_DEV,
  onModeChange: () => { }
});

export const useModeContext = () => React.useContext(ModeContext);

interface ModeProvider {
  children: React.ReactNode;
}

// 无初始值，只有手动toogle的时候才会对mode设值
export const ModeProvider = ({ children }: ModeProvider) => {
  const [mode, setMode] = useState<DebugMode>();

  const toggleMode = useCallback((mode: DebugMode) => {
    setMode(mode);
  }, []);

  return (
    <ModeContext.Provider
      value={{
        mode: mode,
        onModeChange: toggleMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
