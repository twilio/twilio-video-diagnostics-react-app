import React from 'react';
import { ActivePane, useAppStateContext, AppStateProvider, appStateReducer, initialState } from './AppStateProvider';
import { renderHook } from '@testing-library/react-hooks';

describe('the useAppStateContext hook', () => {
  it('should throw an error if used out of the AppStateProvider', () => {
    const { result } = renderHook(useAppStateContext);
    expect(result.error!.message).toBe('useAppStateContext must be used within an AppStateProvider');
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
      const newState = appStateReducer(initialState, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceCheck);
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

    it('should set the active pane to DeviceCheck when current active pane is CameraTest', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.CameraTest,
      };

      const newState = appStateReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceCheck);
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
});

describe('the AppStateProvider component', () => {
  it('should return the AppState Context object', () => {
    // @ts-ignore
    navigator.mediaDevices = {};

    const mockDevices = [
      { deviceId: 1, label: '', kind: 'audioinput' },
      { deviceId: 2, label: '', kind: 'videoinput' },
      { deviceId: 3, label: '', kind: 'audiooutput' },
    ];
    //@ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

    const { result } = renderHook(useAppStateContext, { wrapper });

    expect(result.current).toMatchObject({
      state: initialState,
      dispatch: expect.any(Function),
    });
  });
});
