import React from 'react';
import { PreflightTestReport } from 'twilio-video';
import { VideoInputTest } from '@twilio/rtc-diagnostics';
import {
  ActivePane,
  useAppStateContext,
  AppStateProvider,
  appStateReducer,
  initialState,
  isButtonDisabled,
} from './AppStateProvider';
import { renderHook, act } from '@testing-library/react-hooks';

const mockStartPreflightTest = jest.fn();
const mockGetTwilioStatus = jest.fn();

jest.mock('./usePreflightTest/usePreflightTest', () =>
  jest.fn(() => ({
    startPreflightTest: mockStartPreflightTest,
  }))
);

jest.mock('./useTwilioStatus/useTwilioStatus', () =>
  jest.fn(() => ({
    getTwilioStatus: mockGetTwilioStatus,
  }))
);

describe('the useAppStateContext hook', () => {
  it('should throw an error if used out of the AppStateProvider', () => {
    const { result } = renderHook(useAppStateContext);
    expect(result.error!.message).toBe('useAppStateContext must be used within an AppStateProvider');
  });
});

describe('the isButtonDisabled function', () => {
  it('should return true if preflightTest fails or if Twilio services are down', () => {
    expect(isButtonDisabled('mediaStarted', 'partial_outage', ActivePane.Connectivity)).toBe(true);
  });

  it('should return true if the active pane is the last pane', () => {
    expect(isButtonDisabled(null, 'operational', ActivePane.Results)).toBe(true);
  });

  it('should return true when active pane is DeviceCheck', () => {
    expect(isButtonDisabled(null, 'operational', ActivePane.DeviceCheck)).toBe(true);
  });

  it('should return true when active pane is DeviceError', () => {
    expect(isButtonDisabled(null, 'operational', ActivePane.DeviceError)).toBe(true);
  });

  it('should return false if preflightTest completes and active pane is not in Device setup', () => {
    expect(isButtonDisabled(null, 'operational', ActivePane.CameraTest)).toBe(false);
  });
});

describe('the appState reducer', () => {
  describe('the "set-active-pane" action type', () => {
    it('should set the active pane to the new active pane', () => {
      const newState = appStateReducer(initialState, {
        type: 'set-active-pane',
        newActivePane: ActivePane.Connectivity,
      });

      expect(newState.activePane).toEqual(ActivePane.Connectivity);
    });
  });

  describe('the "next-pane" action type', () => {
    it('should set the active pane to the following pane by default"', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.Connectivity,
      };
      const newState = appStateReducer(draftState, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.Quality);
    });

    it('should set the active pane to DeviceError when an error is thrown after checking device permissions', () => {
      const mockError = Error();
      const draftStateWithDeviceError = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
        deviceError: mockError,
      };

      const newState = appStateReducer(draftStateWithDeviceError, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceError);
    });

    it('should set the active pane to CameraTest when no error is thrown after checking device permissions', () => {
      const draftStateFromDeviceCheckPane = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
      };
      const newState = appStateReducer(draftStateFromDeviceCheckPane, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.CameraTest);
    });

    it('should set the active pane to CameraTest if on GetStarted pane and permissions are already granted for devices', () => {
      const draftStatePermissionsGranted = {
        ...initialState,
        audioGranted: true,
        videoGranted: true,
      };

      const newState = appStateReducer(draftStatePermissionsGranted, { type: 'next-pane' });
      expect(newState.activePane).toEqual(ActivePane.CameraTest);
    });

    it('should set active pane to LoadingScreen if on CameraTest and preflightTest has not finished or thrown an error', () => {
      const draftStateFromCameraTestPane = { ...initialState, activePane: ActivePane.CameraTest };

      const newState = appStateReducer(draftStateFromCameraTestPane, { type: 'next-pane' });
      expect(newState.activePane).toEqual(ActivePane.LoadingScreen);
    });

    it('should set active pane to Connectivity if on CameraTest and preflightTest has finished or thrown an error', () => {
      const mockReport = {} as PreflightTestReport;
      const draftStateFromCameraTestPane = {
        ...initialState,
        activePane: ActivePane.CameraTest,
        preflightTest: { ...initialState.preflightTest, report: mockReport, error: Error() },
      };

      const newState = appStateReducer(draftStateFromCameraTestPane, { type: 'next-pane' });
      expect(newState.activePane).toEqual(ActivePane.Connectivity);
    });
  });

  describe('the "previous-pane" action type', () => {
    it('should set the active pane to the previous pane by default"', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
      };
      const newState = appStateReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.GetStarted);
    });

    it('should set the active pane to GetStarted if on CameraTest with device permissions granted', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.CameraTest,
        audioGranted: true,
        videoGranted: true,
      };
      const newState = appStateReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.GetStarted);
    });

    it('should set the active pane to DeviceCheck when current active pane is CameraTest', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.CameraTest,
      };

      const newState = appStateReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceCheck);
    });

    it('should set active pane to CameraTest if current active pane is Connectivity', () => {
      const draftState = { ...initialState, activePane: ActivePane.Connectivity };

      const newState = appStateReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.CameraTest);
    });
  });

  describe('the "set-devices" action type', () => {
    it('should set audioGranted and videoGranted to true when device permissions are granted', () => {
      const mockDevices = [
        { deviceId: 1, label: '1', kind: 'audioinput' },
        { deviceId: 2, label: '2', kind: 'videoinput' },
        { deviceId: 3, label: '3', kind: 'audiooutput' },
      ];
      const newState = appStateReducer(initialState, { type: 'set-devices', devices: mockDevices as any });

      expect(newState.audioGranted).toEqual(true);
      expect(newState.videoGranted).toEqual(true);
    });

    it('should set audioGranted and videoGranted to false when device permissions are denied', () => {
      const mockDevicesNoLabels = [
        { deviceId: 1, label: '', kind: 'audioinput' },
        { deviceId: 2, label: '', kind: 'videoinput' },
        { deviceId: 3, label: '', kind: 'audiooutput' },
      ];
      const newState = appStateReducer(initialState, { type: 'set-devices', devices: mockDevicesNoLabels as any });

      expect(newState.audioGranted).toEqual(false);
      expect(newState.videoGranted).toEqual(false);
    });
  });

  describe('the "set-device-error" action type', () => {
    it('should set the active pane to DeviceError when an error is present', () => {
      const mockError = Error();

      const newState = appStateReducer(initialState, { type: 'set-device-error', error: mockError });

      expect(newState.activePane).toEqual(ActivePane.DeviceError);
    });
  });

  describe('the "preflight-progress" action type', () => {
    it('should set the progress for the preflight test', () => {
      const newState = appStateReducer(initialState, { type: 'preflight-progress', progress: 'connected' });

      expect(newState.preflightTest.progress).toBe('connected');
    });
  });

  describe('the "preflight-completed" action type', () => {
    it('should save the report from the preflight test on test completion and set preflight test progress back to null', () => {
      const mockReport = {} as PreflightTestReport;
      const newState = appStateReducer(initialState, { type: 'preflight-completed', report: mockReport });

      expect(newState.preflightTest.report).toBe(mockReport);
      expect(newState.preflightTest.progress).toBe(null);
    });
  });

  describe('the "preflight-failed" action type', () => {
    it('should save the preflight test error when preflight test throws an error and set preflight test progress to null', () => {
      const mockError = Error();
      const newState = appStateReducer(initialState, { type: 'preflight-failed', error: mockError });

      expect(newState.preflightTest.error).toBe(mockError);
      expect(newState.preflightTest.progress).toBe(null);
    });
  });

  describe('the "preflight-token-failed" action type', () => {
    it('should save the preflight test tokenError when there is an issue with the token', () => {
      const mockError = Error();
      const newState = appStateReducer(initialState, { type: 'preflight-token-failed', error: mockError });

      expect(newState.preflightTest.tokenError).toBe(mockError);
    });
  });

  describe('the "set-twilio-status" action type', () => {
    it('should save the status for Twilio Programmable Video', () => {
      const newState = appStateReducer(initialState, { type: 'set-twilio-status', status: 'operational' });

      expect(newState.twilioStatus).toBe('operational');
    });
  });

  describe('the "set-twilio-status-error" action type', () => {
    it('should save the error if error is thrown when fetching Twilio Programmable Video status', () => {
      const mockError = Error();
      const newState = appStateReducer(initialState, { type: 'set-twilio-status-error', error: mockError });

      expect(newState.twilioStatusError).toBe(mockError);
    });
  });

  describe('the "set-video-test-report" action type', () => {
    it('should save the report from the VideoInput test', () => {
      const mockReport = {} as VideoInputTest.Report;
      const newState = appStateReducer(initialState, { type: 'set-video-test-report', report: mockReport });

      expect(newState.videoInputTestReport).toBe(mockReport);
    });
  });
});

describe('the AppStateProvider component', () => {
  // @ts-ignore
  navigator.mediaDevices = {};

  const mockDevices = [
    { deviceId: 1, label: '', kind: 'audioinput' },
    { deviceId: 2, label: '', kind: 'videoinput' },
    { deviceId: 3, label: '', kind: 'audiooutput' },
  ];
  //@ts-ignore
  navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);

  it('should return the AppState Context object', () => {
    const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;
    const { result } = renderHook(useAppStateContext, { wrapper });

    expect(result.current).toEqual({
      state: initialState,
      nextPane: expect.any(Function),
      dispatch: expect.any(Function),
    });
  });

  describe('the nextPane function', () => {
    it('should start preflight test, get Twilio status, and go to the next pane when active pane is GetStarted', async () => {
      const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

      const { result, waitForNextUpdate } = renderHook(useAppStateContext, { wrapper });

      await act(async () => {
        result.current.nextPane();
        await waitForNextUpdate();
      });

      expect(mockGetTwilioStatus).toHaveBeenCalled();
      expect(mockStartPreflightTest).toHaveBeenCalled();
      expect(result.current.state.activePane).toBe(ActivePane.DeviceCheck);
    });

    it('should go to the next pane by default', async () => {
      const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

      const { result, waitForNextUpdate } = renderHook(useAppStateContext, { wrapper });

      // since initialState.activePane is GetStarted, we will need to call nextPane() to get set a new activePane
      await act(async () => {
        result.current.nextPane();
        await waitForNextUpdate();
      });

      expect(mockGetTwilioStatus).toHaveBeenCalled();
      expect(mockStartPreflightTest).toHaveBeenCalled();

      // call nextPane() again to test default case (go to next pane without calling getTwilioStatus and startPreflightTest)
      act(() => {
        result.current.nextPane();
      });

      expect(result.current.state.activePane).toBe(ActivePane.CameraTest);
      expect(mockGetTwilioStatus).toHaveBeenCalledTimes(1);
      expect(mockStartPreflightTest).toHaveBeenCalledTimes(1);
    });
  });
});
