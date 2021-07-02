import React, { createContext, useContext, useReducer, useEffect } from 'react';
import produce from 'immer';

export enum ActivePane {
  GetStarted,
  DeviceCheck,
  DeviceError,
  Connectivity,
  Quality,
  Results,
}

interface stateType {
  activePane: ActivePane;
  videoGranted: boolean;
  audioGranted: boolean;
  deviceError: null | Error;
}

type ACTIONTYPE =
  | { type: 'set-active-pane'; newActivePane: ActivePane }
  | { type: 'next-pane' }
  | { type: 'previous-pane' }
  | { type: 'set-devices'; devices: MediaDeviceInfo[] }
  | { type: 'set-device-error'; error: Error };

type AppStateContextType = {
  state: stateType;
  dispatch: React.Dispatch<ACTIONTYPE>;
};

export const initialState = {
  activePane: ActivePane.GetStarted,
  videoGranted: false,
  audioGranted: false,
  deviceError: null,
};

export const AppStateContext = createContext<AppStateContextType>(null!);

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AppStateProvider');
  }
  return context;
}

/**
 * This reducer function helps with the logic used to decide the activePane,
 * as well as which panes are to be shown to the user, and when.
 */

export const appStateReducer = produce((draft: stateType, action: ACTIONTYPE) => {
  switch (action.type) {
    case 'set-active-pane':
      draft.activePane = action.newActivePane;
      break;

    case 'next-pane':
      switch (draft.activePane) {
        case ActivePane.GetStarted:
          if (draft.audioGranted && draft.videoGranted) {
            draft.activePane = ActivePane.Connectivity;
          } else {
            draft.activePane = ActivePane.DeviceCheck;
          }
          break;
        case ActivePane.DeviceCheck:
          if (draft.deviceError) {
            draft.activePane = ActivePane.DeviceError;
          } else {
            draft.activePane = ActivePane.Connectivity;
          }
          break;
        default:
          draft.activePane++;
          break;
      }
      break;

    case 'previous-pane':
      switch (draft.activePane) {
        case ActivePane.Connectivity:
          if (draft.audioGranted && draft.videoGranted) {
            draft.activePane = ActivePane.GetStarted;
          } else {
            draft.activePane = ActivePane.DeviceCheck;
          }
          break;
        default:
          draft.activePane--;
          break;
      }
      break;

    case 'set-devices':
      draft.audioGranted = action.devices.filter((d) => d.kind === 'audioinput').every((d) => d.label);
      draft.videoGranted = action.devices.filter((d) => d.kind === 'videoinput').every((d) => d.label);
      break;

    case 'set-device-error':
      draft.deviceError = action.error;
      draft.activePane = ActivePane.DeviceError;
  }
});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => dispatch({ type: 'set-devices', devices }));
  }, []);

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>;
};
