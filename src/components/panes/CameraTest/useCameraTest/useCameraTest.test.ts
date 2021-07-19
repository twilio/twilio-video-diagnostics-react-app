import { renderHook, act } from '@testing-library/react-hooks';
import { testVideoInputDevice } from '@twilio/rtc-diagnostics';
import { useCameraTest } from './useCameraTest';

const mockVideoTest = { stop: jest.fn() };
jest.mock('@twilio/rtc-diagnostics', () => ({ testVideoInputDevice: jest.fn(() => mockVideoTest) }));

describe('the useCameraTest hook', () => {
  it('should correctly return default values', () => {
    const { result } = renderHook(useCameraTest);
    expect(result.current.videoTest).toBe(undefined);
    expect(result.current.videoElementRef.current).toBe(null);
  });

  it('should start and stop a test', () => {
    const { result } = renderHook(useCameraTest);
    result.current.videoElementRef.current = document.createElement('video');

    act(() => {
      result.current.startVideoTest('mockDeviceID');
    });

    expect(testVideoInputDevice).toHaveBeenCalledWith({
      deviceId: 'mockDeviceID',
      element: expect.any(HTMLVideoElement),
    });
    expect(result.current.videoTest).toBe(mockVideoTest);

    act(() => {
      result.current.stopVideoTest();
    });

    expect(mockVideoTest.stop).toHaveBeenCalled();
    expect(result.current.videoTest).toBeUndefined();
  });

  it('should not throw error when stopVideoTest is called when there is no active test', () => {
    const { result } = renderHook(useCameraTest);
    result.current.videoElementRef.current = document.createElement('video');

    result.current.stopVideoTest();
  });
});
