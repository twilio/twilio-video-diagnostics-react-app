import React, { createContext, useContext, useReducer } from 'react';
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

const initialState = {
  activePane: ActivePane.GetStarted,
  videoGranted: false,
  audioGranted: false,
  deviceError: null,
};

type ACTIONTYPE =
  | { type: 'set-active-pane'; newActivePane: ActivePane }
  | { type: 'next-pane' }
  | { type: 'previous-pane' }
  | { type: 'set-devices'; devices: MediaDeviceInfo[] }
  | { type: 'set-device-error'; error: Error };

type AppStateContextType = {
  state: stateType;
  dispatch: React.Dispatch<ACTIONTYPE>;
  nextPane: () => void;
};

export const AppStateContext = createContext<AppStateContextType>(null!);

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AppStateProvider');
  }
  return context;
}

export const immerReducer = produce((draft: stateType, action: ACTIONTYPE) => {
  switch (action.type) {
    case 'set-active-pane':
      draft.activePane = action.newActivePane;
      break;

    case 'next-pane':
      switch (draft.activePane) {
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
          draft.activePane = ActivePane.DeviceCheck;
          break;
        default:
          draft.activePane--;
          break;
      }
      break;

    case 'set-devices':
      if (action.devices.filter((d: any) => d.kind === 'audioinput').every((d: any) => d.label)) {
        draft.audioGranted = true;
      } else {
        draft.audioGranted = false;
      }
      if (action.devices.filter((d: any) => d.kind === 'videoinput').every((d: any) => d.label)) {
        draft.videoGranted = true;
      } else {
        draft.videoGranted = false;
      }
      break;

    case 'set-device-error':
      draft.deviceError = action.error;
      draft.activePane = ActivePane.DeviceError;
  }
});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(immerReducer, initialState);

  const nextPane = () => {
    switch (state.activePane) {
      case ActivePane.GetStarted:
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          dispatch({ type: 'set-devices', devices });
          dispatch({ type: 'next-pane' });
        });
        break;
      case ActivePane.DeviceCheck:
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          dispatch({ type: 'set-devices', devices });
          dispatch({ type: 'next-pane' });
        });
        break;
      default:
        dispatch({ type: 'next-pane' });
    }
  };

  return <AppStateContext.Provider value={{ state, dispatch, nextPane }}>{children}</AppStateContext.Provider>;
};
