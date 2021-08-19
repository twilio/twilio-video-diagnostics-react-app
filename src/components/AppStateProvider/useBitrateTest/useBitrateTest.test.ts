import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import EventEmitter from 'events';
import useBitrateTest from './useBitrateTest';

class MockBitrateTest extends EventEmitter {
  stop = jest.fn();
}

const mockBitrateTest = new MockBitrateTest();
const mockAxios = axios as any as jest.Mock<any>;

jest.mock('@twilio/rtc-diagnostics', () => ({
  testMediaConnectionBitrate: jest.fn(() => mockBitrateTest),
  MediaConnectionBitrateTest: {
    Events: {
      Bitrate: 'Bitrate',
      Error: 'Error',
      End: 'End',
    },
  },
}));

jest.mock('axios', () =>
  jest.fn(() => Promise.resolve({ data: { iceServers: ['mockIceServers', 'mockIceServers'] } }))
);

describe('the useBitrateTest hook', () => {
  it('should dispatch "bitrate-test-started" when "startBitrateTest" function is called', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    result.current.startBitrateTest();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-started' });
  });

  it('should dispatch "set-bitrate" when "bitrate" event is emitted', async () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    return result.current.startBitrateTest()!.then(() => {
      mockBitrateTest.emit('Bitrate', 'mockBitrate');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate', bitrate: 'mockBitrate' });
    });
  });

  it('should dispatch "set-bitrate-test-error" and "bitrate-test-finished" when "error" event is emitted', async () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    return result.current.startBitrateTest()!.then(() => {
      mockBitrateTest.emit('Error', 'mockError');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-error', error: 'mockError' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
    });
  });

  it('should dispatch "set-bitrate-test-report" and "bitrate-test-finished" when "end" event is emitted', async () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    return result.current.startBitrateTest()!.then(() => {
      mockBitrateTest.emit('End', 'mockReport');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-report', report: 'mockReport' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
    });
  });

  it('should dispatch "set-bitrate-test-error" and "bitrate-test-finished" when there is an error obtaining TURN credentials', () => {
    const mockDispatch = jest.fn();
    mockAxios.mockImplementationOnce(() => Promise.reject('mockError'));
    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    return result.current.startBitrateTest()!.then(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-error', error: 'mockError' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
    });
  });

  it('should stop the test after 15 seconds', async () => {
    jest.useFakeTimers();
    const mockDispatch = jest.fn();

    const { result } = renderHook(() => useBitrateTest(mockDispatch));

    await act(async () => await result.current.startBitrateTest());

    jest.runTimersToTime(15000);

    expect(mockBitrateTest.stop).toHaveBeenCalled();
  });

  it('should not start the bitrate test if there is already one running', (done) => {
    const { result } = renderHook(() => useBitrateTest(() => {}));

    result.current.startBitrateTest();

    setImmediate(() => {
      // startBitrateTest() returns undefined if there is already a bitrate test running
      expect(result.current.startBitrateTest()).toBe(undefined);
      done();
    });
  });
});
