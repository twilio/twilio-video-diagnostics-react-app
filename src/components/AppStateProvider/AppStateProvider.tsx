import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import produce, { current } from 'immer';
import { PreflightTestReport } from 'twilio-video';
import usePreflightTest from './usePreflightTest/usePreflightTest';
import useTwilioStatus from './useTwilioStatus/useTwilioStatus';
import { VideoInputTest } from '@twilio/rtc-diagnostics';
import { AudioInputTest } from '@twilio/rtc-diagnostics';
import { AudioOutputTest } from '@twilio/rtc-diagnostics';

export enum ActivePane {
  GetStarted,
  DeviceCheck,
  DeviceError,
  CameraTest,
  AudioTest,
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
    progress: string | null;
    error: null | Error;
    report: null | PreflightTestReport;
    tokenError: null | Error;
    signalingGatewayReachable: boolean;
    turnServersReachable: boolean;
  };
  twilioStatus: string | null;
  twilioStatusError: null | Error;
  videoInputTestReport: null | VideoInputTest.Report;
  audioInputTestReport: null | AudioInputTest.Report;
  audioOutputTestReport: null | AudioOutputTest.Report;
  downButtonDisabled: boolean;
  preflightTestInProgress: boolean;
  preflightTestFinished: boolean;
}

export type ACTIONTYPE =
  | { type: 'set-active-pane'; newActivePane: ActivePane }
  | { type: 'next-pane' }
  | { type: 'previous-pane' }
  | { type: 'set-devices'; devices: MediaDeviceInfo[] }
  | { type: 'set-device-error'; error: Error }
  | { type: 'set-video-test-report'; report: VideoInputTest.Report }
  | { type: 'set-audio-input-test-report'; report: AudioInputTest.Report }
  | { type: 'set-audio-output-test-report'; report: AudioOutputTest.Report }
  | { type: 'preflight-progress'; progress: string }
  | { type: 'preflight-completed'; report: PreflightTestReport }
  | { type: 'preflight-failed'; error: Error }
  | { type: 'preflight-token-failed'; error: Error }
  | { type: 'set-twilio-status'; status: string }
  | { type: 'set-twilio-status-error'; error: Error }
  | { type: 'set-video-test-report'; report: VideoInputTest.Report }
  | { type: 'preflight-started' }
  | { type: 'preflight-finished' };

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
    progress: null,
    report: null,
    error: null,
    tokenError: null,
    signalingGatewayReachable: false,
    turnServersReachable: false,
  },
  twilioStatus: null,
  twilioStatusError: null,
  videoInputTestReport: null,
  audioInputTestReport: null,
  audioOutputTestReport: null,
  downButtonDisabled: false,
  preflightTestInProgress: false,
  preflightTestFinished: false,
};

export const AppStateContext = createContext<AppStateContextType>(null!);

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AppStateProvider');
  }
  return context;
}

// helper function for determining whether to disable the down arrow button:
export const isDownButtonDisabled = (
  inProgress: boolean,
  status: string | null,
  pane: ActivePane,
  preflightError: Error | null
) => {
  const connectionFailedOrLoading =
    pane === ActivePane.Connectivity && (inProgress || status !== 'operational' || preflightError !== null);
  const onDeviceCheck = pane === ActivePane.DeviceCheck || pane === ActivePane.DeviceError;

  if (connectionFailedOrLoading || !ActivePane[pane + 1] || onDeviceCheck) return true;

  return false;
};

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
            draft.activePane = ActivePane.CameraTest;
          } else {
            draft.activePane = ActivePane.DeviceCheck;
          }
          break;
        case ActivePane.DeviceCheck:
          if (draft.deviceError) {
            draft.activePane = ActivePane.DeviceError;
          } else {
            draft.activePane = ActivePane.CameraTest;
          }
          break;
        default:
          draft.activePane++;
          break;
      }
      break;

    case 'previous-pane':
      switch (draft.activePane) {
        case ActivePane.CameraTest:
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

      if (action.progress === 'dtlsConnected') {
        draft.preflightTest.signalingGatewayReachable = true;
      }

      if (action.progress === 'mediaAcquired') {
        draft.preflightTest.turnServersReachable = true;
      }
      break;

    case 'preflight-completed':
      draft.preflightTest.report = action.report;
      draft.preflightTest.progress = null;
      break;

    case 'preflight-failed':
      draft.preflightTest.error = action.error;
      draft.preflightTest.progress = null;
      break;

    case 'preflight-token-failed':
      draft.preflightTest.tokenError = action.error;
      break;

    case 'set-twilio-status':
      draft.twilioStatus = action.status;
      break;

    case 'set-twilio-status-error':
      draft.twilioStatusError = action.error;
      break;

    case 'set-video-test-report':
      draft.videoInputTestReport = action.report;
      break;

    case 'set-audio-input-test-report':
      draft.audioInputTestReport = action.report;
      break;

    case 'set-audio-output-test-report':
      draft.audioOutputTestReport = action.report;
      break;

    case 'preflight-started':
      draft.preflightTestInProgress = true;
      draft.preflightTestFinished = false;
      break;

    case 'preflight-finished':
      draft.preflightTestFinished = true;
      draft.preflightTestInProgress = false;
      break;
  }

  const currentState = current(draft);

  draft.downButtonDisabled = isDownButtonDisabled(
    currentState.preflightTestInProgress,
    currentState.twilioStatus,
    currentState.activePane,
    currentState.preflightTest.error
  );
});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  const { startPreflightTest } = usePreflightTest(dispatch);
  const { getTwilioStatus } = useTwilioStatus(dispatch);

  const nextPane = useCallback(() => {
    switch (state.activePane) {
      case ActivePane.GetStarted:
        startPreflightTest();
        getTwilioStatus();
        dispatch({ type: 'next-pane' });
        break;
      default:
        dispatch({ type: 'next-pane' });
    }
  }, [startPreflightTest, getTwilioStatus, state, dispatch]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => dispatch({ type: 'set-devices', devices }));
  }, []);

  return <AppStateContext.Provider value={{ state, dispatch, nextPane }}>{children}</AppStateContext.Provider>;
};
