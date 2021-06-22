import React, { createContext, useState, useContext } from 'react';

export enum ActivePane {
  GetStarted,
  DeviceCheck,
  DeviceError,
  Connectivity,
  Quality,
  Results,
}

type AppStateContextType = {
  activePane: ActivePane;
  setActivePane: React.Dispatch<React.SetStateAction<ActivePane>>;
  deviceError: Error;
  setDeviceError: React.Dispatch<React.SetStateAction<Error>>;
};

export const AppStateContext = createContext<AppStateContextType>(null!);

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within a AppStateProvider');
  }
  return context;
}

export const AppStateProvider: React.FC = ({ children }) => {
  const [activePane, setActivePane] = useState(ActivePane.GetStarted);
  const [deviceError, setDeviceError] = useState<Error>();

  return (
    <AppStateContext.Provider value={{ activePane, setActivePane, deviceError, setDeviceError }}>
      {children}
    </AppStateContext.Provider>
  );
};
