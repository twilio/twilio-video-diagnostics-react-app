import React, { createContext, useState, useContext } from 'react';

export enum ActivePane {
  GetStarted,
  DeviceSetup,
  Connectivity,
  Quality,
  Results,
}

type AppStateContextType = {
  activePane: ActivePane;
  setActivePane: React.Dispatch<React.SetStateAction<ActivePane>>;
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

  return <AppStateContext.Provider value={{ activePane, setActivePane }}>{children}</AppStateContext.Provider>;
};
