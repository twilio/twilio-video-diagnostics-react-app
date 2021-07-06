import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import produce from 'immer';
import { PreflightTestReport } from 'twilio-video';
import usePreflightTest from './usePreflightTest/usePreflightTest';

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
  preflightTest: {
    progress: string;
    error: null | Error;
    report: null | PreflightTestReport;
    tokenError: null | Error;
  };
}

export type ACTIONTYPE =
  | { type: 'set-active-pane'; newActivePane: ActivePane }
  | { type: 'next-pane' }
  | { type: 'previous-pane' }
  | { type: 'set-devices'; devices: MediaDeviceInfo[] }
  | { type: 'set-device-error'; error: Error }
  | { type: 'preflight-progress'; progress: string }
  | { type: 'preflight-completed'; report: PreflightTestReport }
  | { type: 'preflight-failed'; error: Error }
  | { type: 'preflight-token-failed'; error: Error };

type AppStateContextType = {
  state: stateType;
  dispatch: React.Dispatch<ACTIONTYPE>;
  nextPane: () => void;
};

export const initialState = {
  activePane: ActivePane.GetStarted,
  videoGranted: false,
  audioGranted: false,
  deviceError: null,
  preflightTest: {
    progress: '',
    report: null,
    error: null,
    tokenError: null,
  },
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
      break;

    case 'preflight-progress':
      draft.preflightTest.progress = action.progress;
      break;

    case 'preflight-completed':
      draft.preflightTest.report = action.report;
      break;

    case 'preflight-failed':
      draft.preflightTest.error = action.error;
      break;

    case 'preflight-token-failed':
      draft.preflightTest.tokenError = action.error;
      break;
  }
});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  const { startPreflightTest } = usePreflightTest(dispatch);

  const nextPane = useCallback(() => {
    switch (state.activePane) {
      case ActivePane.GetStarted:
        startPreflightTest();
        dispatch({ type: 'next-pane' });
        break;
      default:
        dispatch({ type: 'next-pane' });
    }
  }, [startPreflightTest, state, dispatch]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => dispatch({ type: 'set-devices', devices }));
  }, []);

  return <AppStateContext.Provider value={{ state, dispatch, nextPane }}>{children}</AppStateContext.Provider>;
};
