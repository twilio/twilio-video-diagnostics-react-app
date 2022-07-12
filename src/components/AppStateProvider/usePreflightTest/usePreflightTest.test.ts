import usePreflightTest from './usePreflightTest';
import axios from 'axios';
import EventEmitter from 'events';
import { renderHook } from '@testing-library/react-hooks';
import { setImmediate } from 'timers';

const mockPreflightTest = new EventEmitter();

jest.mock('axios', () => jest.fn(() => Promise.resolve({ data: { token: 'mockToken' } })));
jest.mock('twilio-video', () => ({ runPreflight: jest.fn(() => mockPreflightTest) }));

const mockAxios = axios as any as jest.Mock<any>;

describe('the usePreflightTest hook', () => {
  it('should dispatch "preflight-started" when "startPreflightTest" function is called', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => usePreflightTest(mockDispatch));

    result.current.startPreflightTest();

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-started' });
  });

  it('should dispatch "preflight-progress" when the "progress" event is emitted', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => usePreflightTest(mockDispatch));

    return result.current.startPreflightTest()!.then(() => {
      mockPreflightTest.emit('progress', 'started');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-progress', progress: 'started' });
    });
  });

  it('should dispatch "preflight-failed" and "preflight-finished" when the "failed" event is emitted', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => usePreflightTest(mockDispatch));

    return result.current.startPreflightTest()!.then(() => {
      mockPreflightTest.emit('failed', 'error');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-failed', error: 'error' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-finished' });
    });
  });

  it('should dispatch "preflight-completed" and "preflight-finished" when the "completed" event is emitted', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => usePreflightTest(mockDispatch));

    return result.current.startPreflightTest()!.then(() => {
      mockPreflightTest.emit('completed', 'report');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-completed', report: 'report' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-finished' });
    });
  });

  it('should dispatch "preflight-token-error" and "preflight-finished" when there is an error obtaining the token', () => {
    const mockDispatch = jest.fn();
    mockAxios.mockImplementationOnce(() => Promise.reject('mockError'));
    const { result } = renderHook(() => usePreflightTest(mockDispatch));

    return result.current.startPreflightTest()!.then(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-token-failed', error: 'mockError' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'preflight-finished' });
    });
  });

  it('should not start the preflight test if there is already one running', (done) => {
    const { result } = renderHook(() => usePreflightTest(() => {}));

    result.current.startPreflightTest();

    setImmediate(() => {
      // startPreflightTest() returns undefined if there is already a preflight test running
      expect(result.current.startPreflightTest()).toBe(undefined);
      done();
    });
  });
});
