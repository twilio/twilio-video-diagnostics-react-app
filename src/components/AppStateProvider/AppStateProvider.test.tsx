import React from 'react';
import { ActivePane, useAppStateContext, AppStateProvider, immerReducer } from './AppStateProvider';
import { act, renderHook } from '@testing-library/react-hooks';

const initialState = {
  activePane: ActivePane.GetStarted,
  videoGranted: false,
  audioGranted: false,
  deviceError: null,
};

describe('the useAppStateContext hook', () => {
  it('should throw an error if used out of the AppStateProvider', () => {
    const { result } = renderHook(useAppStateContext);
    expect(result.error!.message).toBe('useAppStateContext must be used within an AppStateProvider');
  });
});

describe('the immer reducer', () => {
  describe('the "set-active-pane" action type', () => {
    it('should correctly set the active pane to the new active pane', () => {
      const newState = immerReducer(initialState, { type: 'set-active-pane', newActivePane: ActivePane.Connectivity });

      expect(newState.activePane).toEqual(ActivePane.Connectivity);
    });
  });

  describe('the "next-pane" action type', () => {
    it('should correctly set the active pane to the following pane', () => {
      const newState = immerReducer(initialState, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceCheck);
    });

    it('should correctly set the active pane to DeviceError when an error is thrown after checking device permissions', () => {
      const mockError = Error();
      const draftStateWithDeviceError = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
        deviceError: mockError,
      };

      const newState = immerReducer(draftStateWithDeviceError, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.DeviceError);
    });

    it('should correctly set the active pane to Connectivity when no error is thrown after checking device permissions', () => {
      const draftStateFromDeviceCheckPane = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
      };
      const newState = immerReducer(draftStateFromDeviceCheckPane, { type: 'next-pane' });

      expect(newState.activePane).toEqual(ActivePane.Connectivity);
    });
  });

  describe('the "previous-pane" action type', () => {
    it('should correctly set the active pane to the previous pane"', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.DeviceCheck,
      };
      const newState = immerReducer(draftState, { type: 'previous-pane' });

      expect(newState.activePane).toEqual(ActivePane.GetStarted);
    });

    it('should correctly set the active pane to DeviceCheck when current active pane is Connectivity', () => {
      const draftState = {
        ...initialState,
        activePane: ActivePane.Connectivity,
      };

      const newState = immerReducer(draftState, { type: 'previous-pane' });

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
      const newState = immerReducer(initialState, { type: 'set-devices', devices: mockDevices as any });

      expect(newState.audioGranted).toEqual(true);
      expect(newState.videoGranted).toEqual(true);
    });

    it('should set audioGranted and videoGranted to false when device permissions are denied', () => {
      const mockDevicesNoLabels = [
        { deviceId: 1, label: '', kind: 'audioinput' },
        { deviceId: 2, label: '', kind: 'videoinput' },
        { deviceId: 3, label: '', kind: 'audiooutput' },
      ];
      const newState = immerReducer(initialState, { type: 'set-devices', devices: mockDevicesNoLabels as any });

      expect(newState.audioGranted).toEqual(false);
      expect(newState.videoGranted).toEqual(false);
    });
  });

  describe('the "set-device-error" action type', () => {
    it('should set the active pane to DeviceError when an error is present', () => {
      const mockError = Error();

      const newState = immerReducer(initialState, { type: 'set-device-error', error: mockError });

      expect(newState.activePane).toEqual(ActivePane.DeviceError);
    });
  });
});

describe('the AppStateProvider component', () => {
  it('should correctly return the AppState Context object', () => {
    const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;
    const { result } = renderHook(useAppStateContext, { wrapper });

    expect(result.current).toMatchObject({
      state: { activePane: 0, audioGranted: false, deviceError: null, videoGranted: false },
      dispatch: expect.any(Function),
      nextPane: expect.any(Function),
    });
  });

  describe('the nextPane function', () => {
    // @ts-ignore
    navigator.mediaDevices = {};

    it('should set device permissions and go to next pane when the active pane is GetStarted', async () => {
      const mockDevices = [
        { deviceId: 1, label: '1', kind: 'audioinput' },
        { deviceId: 2, label: '2', kind: 'videoinput' },
        { deviceId: 3, label: '3', kind: 'audiooutput' },
      ];
      //@ts-ignore
      navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);

      const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;
      const { result } = renderHook(useAppStateContext, { wrapper });
      const nextPane = result.current.nextPane;

      await act(async () => {
        await nextPane();
      });

      expect(result.current.state.activePane).toBe(ActivePane.DeviceCheck);
      expect(result.current.state.audioGranted).toBe(true);
      expect(result.current.state.videoGranted).toBe(true);
    });

    it('should set device permissions and go to next pane when the active pane is DeviceCheck', async () => {
      const mockDevicesNoLabels = [
        { deviceId: 1, label: '', kind: 'audioinput' },
        { deviceId: 2, label: '', kind: 'videoinput' },
        { deviceId: 3, label: '', kind: 'audiooutput' },
      ];
      //@ts-ignore
      navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevicesNoLabels);

      const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;
      const { result } = renderHook(useAppStateContext, { wrapper });
      const nextPane = result.current.nextPane;

      result.current.state.activePane = ActivePane.DeviceCheck;

      await act(async () => {
        await nextPane();
      });

      expect(result.current.state.activePane).toBe(ActivePane.Connectivity);
      expect(result.current.state.audioGranted).toBe(false);
      expect(result.current.state.videoGranted).toBe(false);
    });
  });
});
