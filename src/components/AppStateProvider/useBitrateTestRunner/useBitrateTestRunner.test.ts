import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import EventEmitter from 'events';
import useBitrateTestRunner from './useBitrateTestRunner';

class MockBitrateTest extends EventEmitter {
  stop = jest.fn();
}

const mockAxios = axios as any as jest.Mock<any>;
const mockBitrateTest = new MockBitrateTest();

jest.mock('axios', () =>
  jest.fn(() => Promise.resolve({ data: { iceServers: ['mockIceServers', 'mockIceServers'] } }))
);
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

const mockDispatch = jest.fn();

describe('the useBitrateTestRunner hook', () => {
  afterEach(() => jest.clearAllMocks());
  it('should dispatch "bitrate-test-started" when "startBitrateTest" function is called', async () => {
    const { result } = renderHook(() => useBitrateTestRunner(mockDispatch));

    await act(async () => await result.current.startBitrateTest());
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-started' });
  });

  it('should dispatch "set-bitrate" when "bitrate" event is emitted', async () => {
    renderHook(() => useBitrateTestRunner(mockDispatch));

    mockBitrateTest.emit('Bitrate', 'mockBitrate');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate', bitrate: 'mockBitrate' });
  });

  it('should dispatch "set-bitrate-test-error" and "bitrate-test-finished" when "error" event is emitted', async () => {
    renderHook(() => useBitrateTestRunner(mockDispatch));

    mockBitrateTest.emit('Error', 'mockError');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-error', error: 'mockError' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
  });

  it('should dispatch "set-bitrate-test-report" and "bitrate-test-finished" when "end" event is emitted', async () => {
    renderHook(() => useBitrateTestRunner(mockDispatch));

    mockBitrateTest.emit('End', 'mockReport');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-report', report: 'mockReport' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
  });

  it('should dispatch "preflight-token-error" and "preflight-finished" when there is an error obtaining the token', () => {
    mockAxios.mockImplementationOnce(() => Promise.reject('mockError'));
    const { result } = renderHook(() => useBitrateTestRunner(mockDispatch));

    return result.current.startBitrateTest()!.then(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-bitrate-test-error', error: 'mockError' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'bitrate-test-finished' });
    });
  });

  it('should stop the test after 15 seconds', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useBitrateTestRunner(mockDispatch));

    await act(async () => await result.current.startBitrateTest());

    jest.runTimersToTime(15000);

    expect(mockBitrateTest.stop).toHaveBeenCalled();
  });
});
