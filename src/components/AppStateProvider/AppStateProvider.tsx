import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import produce, { current } from 'immer';
import Video, { PreflightTestReport } from 'twilio-video';
import UAParser from 'ua-parser-js';
import usePreflightTest from './usePreflightTest/usePreflightTest';
import useTwilioStatus from './useTwilioStatus/useTwilioStatus';
import useBitrateTest from './useBitrateTest/useBitrateTest';
import { VideoInputTest, MediaConnectionBitrateTest, AudioInputTest, AudioOutputTest } from '@twilio/rtc-diagnostics';

export enum ActivePane {
  GetStarted,
  DeviceCheck,
  DeviceError,
  CameraTest,
  AudioTest,
  BrowserTest,
  Connectivity,
  Quality,
  Results,
}

export type TwilioAPIStatus = 'operational' | 'major_outage' | 'partial_outage' | 'degraded_performance';

export interface TwilioStatus {
  ['Group Rooms']?: TwilioAPIStatus;
  ['Go Rooms']?: TwilioAPIStatus;
  ['Peer-to-Peer Rooms']?: TwilioAPIStatus;
  ['Recordings']?: TwilioAPIStatus;
  ['Compositions']?: TwilioAPIStatus;
  ['Network Traversal Service']?: TwilioAPIStatus;
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
  twilioStatus: TwilioStatus | null;
  twilioStatusError: null | Error;
  videoInputTestReport: null | VideoInputTest.Report;
  audioInputTestReport: null | AudioInputTest.Report;
  audioOutputTestReport: null | AudioOutputTest.Report;
  downButtonDisabled: boolean;
  preflightTestInProgress: boolean;
  preflightTestFinished: boolean;
  bitrateTest: {
    bitrate: null | number;
    report: null | MediaConnectionBitrateTest.Report;
    error: null | Error;
  };
  bitrateTestInProgress: boolean;
  bitrateTestFinished: boolean;
  appIsExpired: boolean;
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
  | { type: 'set-twilio-status'; statusObj: TwilioStatus }
  | { type: 'set-twilio-status-error'; error: Error }
  | { type: 'preflight-started' }
  | { type: 'preflight-finished' }
  | { type: 'set-bitrate'; bitrate: number }
  | { type: 'set-bitrate-test-error'; error: Error }
  | { type: 'set-bitrate-test-report'; report: MediaConnectionBitrateTest.Report }
  | { type: 'bitrate-test-started' }
  | { type: 'bitrate-test-finished' }
  | { type: 'set-app-is-expired' };

type AppStateContextType = {
  state: stateType;
  dispatch: React.Dispatch<ACTIONTYPE>;
  nextPane: () => void;
  userAgentInfo: UAParser.IResult;
  downloadFinalTestResults: () => void;
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
  bitrateTest: {
    bitrate: null,
    report: null,
    error: null,
  },
  bitrateTestInProgress: false,
  bitrateTestFinished: false,
  appIsExpired: false,
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
export const isDownButtonDisabled = (currentState: stateType) => {
  const {
    activePane,
    preflightTestInProgress,
    preflightTest,
    bitrateTestInProgress,
    audioInputTestReport,
    audioOutputTestReport,
    videoInputTestReport,
    appIsExpired,
  } = currentState;

  const connectionFailedOrLoading =
    activePane === ActivePane.Connectivity &&
    (preflightTestInProgress ||
      bitrateTestInProgress ||
      preflightTest.error !== null ||
      preflightTest.tokenError !== null);

  const deviceTestErrors =
    !!audioInputTestReport?.errors.length ||
    !!audioOutputTestReport?.errors.length ||
    !!videoInputTestReport?.errors.length;

  const onDeviceCheck = activePane === ActivePane.DeviceCheck || activePane === ActivePane.DeviceError;
  const unsupportedBrowser = activePane === ActivePane.BrowserTest && !Video.isSupported;

  return (
    appIsExpired ||
    connectionFailedOrLoading ||
    !ActivePane[activePane + 1] ||
    deviceTestErrors ||
    onDeviceCheck ||
    unsupportedBrowser
  );
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
      // Safari does not support RTCDtlsTransport, so we use 'peerConnectionConnected' to determine if Signaling Gateway is reachable
      if (action.progress === 'dtlsConnected' || action.progress === 'peerConnectionConnected') {
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
      draft.twilioStatus = action.statusObj;
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

    case 'set-bitrate':
      draft.bitrateTest.bitrate = action.bitrate;
      break;

    case 'set-bitrate-test-report':
      draft.bitrateTest.report = action.report;
      break;

    case 'set-bitrate-test-error':
      draft.bitrateTest.error = action.error;
      break;

    case 'bitrate-test-started':
      draft.bitrateTestInProgress = true;
      draft.bitrateTestFinished = false;
      break;

    case 'bitrate-test-finished':
      draft.bitrateTestFinished = true;
      draft.bitrateTestInProgress = false;
      break;

    case 'set-app-is-expired':
      draft.appIsExpired = true;
  }

  const currentState = current(draft);

  draft.downButtonDisabled = isDownButtonDisabled(currentState);
});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  const { startPreflightTest } = usePreflightTest(dispatch);
  const { startBitrateTest } = useBitrateTest(dispatch);
  const { getTwilioStatus } = useTwilioStatus(dispatch);

  const userAgentParser = new UAParser();
  const userAgentInfo = userAgentParser.getResult();

  const downloadFinalTestResults = () => {
    const signalingGateway = state.preflightTest.signalingGatewayReachable ? 'Reachable' : 'Unreachable';
    const turnServers = state.preflightTest.turnServersReachable ? 'Reachable' : 'Unreachable';
    const maxBitrate = state.bitrateTest.report?.values ? Math.max(...state.bitrateTest.report.values) : 0;

    const finalTestResults = {
      audioTestResults: { inputTest: state.audioInputTestReport, outputTest: state.audioOutputTestReport },
      bitrateTestResults: { maxBitrate, ...state.bitrateTest.report },
      browserInformation: userAgentInfo,
      connectivityResults: {
        twilioServices: { ...state.twilioStatus },
        signalingRegion: signalingGateway,
        TURN: turnServers,
      },
      preflightTestReport: { report: state.preflightTest.report, error: state.preflightTest.error?.message || null },
      videoTestResults: state.videoInputTestReport,
    };

    const link = document.createElement('a');
    link.download = 'test_results.json';
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(finalTestResults, null, 2)], {
        type: 'text/plain',
      })
    );
    link.click();
  };

  const nextPane = useCallback(() => {
    switch (state.activePane) {
      case ActivePane.GetStarted:
        startBitrateTest();
        startPreflightTest();
        getTwilioStatus();
        dispatch({ type: 'next-pane' });
        break;
      default:
        dispatch({ type: 'next-pane' });
    }
  }, [startBitrateTest, startPreflightTest, getTwilioStatus, state, dispatch]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => dispatch({ type: 'set-devices', devices }));

    axios('app/token').catch((error: AxiosError) => {
      if (error.response?.data?.error?.message === 'token server expired') {
        dispatch({ type: 'set-app-is-expired' });
      }
    });
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch, nextPane, userAgentInfo, downloadFinalTestResults }}>
      {children}
    </AppStateContext.Provider>
  );
};
