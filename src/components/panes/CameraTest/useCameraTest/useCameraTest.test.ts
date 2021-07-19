import { EventEmitter } from 'events';
import { renderHook, act } from '@testing-library/react-hooks';
import { testVideoInputDevice } from '@twilio/rtc-diagnostics';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { useCameraTest } from './useCameraTest';

class MockVideoTest extends EventEmitter {
  stop = jest.fn();
}

let mockVideoTest: MockVideoTest;

jest.mock('@twilio/rtc-diagnostics', () => ({
  testVideoInputDevice: jest.fn(() => {
    mockVideoTest = new MockVideoTest();
    return mockVideoTest;
  }),
  VideoInputTest: {
    Events: {
      End: 'end',
      Error: 'error',
    },
  },
}));

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({ dispatch: mockDispatch }));

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

  it('should not throw an error when stopVideoTest is called when there is no active test', () => {
    const { result } = renderHook(useCameraTest);

    result.current.stopVideoTest();

    expect(result.current.videoTestError).toBe(undefined);
  });

  it('should throw an error when there is an error testing the video input device', () => {
    const { result } = renderHook(useCameraTest);

    expect(result.current.videoTestError).toBe(undefined);

    act(() => {
      result.current.startVideoTest('mockDeviceID');
      mockVideoTest.emit('error', {
        message: 'test error message',
      });
    });

    expect(result.current.videoTestError!.message).toBe('test error message');
  });

  it('should save the video test report to AppStateProvider when test ends', () => {
    const { result } = renderHook(useCameraTest);

    const mockTestReport = {
      deviceId: 'mockDeviceId',
      resolution: { height: 10, width: 10 },
      testTiming: { start: 90 },
      errors: [],
      testName: 'mock test',
    };

    act(() => {
      result.current.startVideoTest('mockDeviceID');
      mockVideoTest.emit('end', mockTestReport);
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-video-test-report', report: mockTestReport });
  });
});
