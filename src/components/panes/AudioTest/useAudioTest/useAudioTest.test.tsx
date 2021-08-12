import { EventEmitter } from 'events';
import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import useAudioTest from './useAudioTest';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({ dispatch: mockDispatch }));
class MockAudioInputTest extends EventEmitter {
  stop = jest.fn();
}
class MockAudioOutputTest extends EventEmitter {
  stop = jest.fn();
}

let mockAudioInputTest: MockAudioInputTest;
let mockAudioOutputTest: MockAudioOutputTest;

jest.mock('@twilio/rtc-diagnostics', () => ({
  testAudioInputDevice: jest.fn(() => {
    mockAudioInputTest = new MockAudioInputTest();
    return mockAudioInputTest;
  }),
  testAudioOutputDevice: jest.fn(() => {
    mockAudioOutputTest = new MockAudioOutputTest();
    return mockAudioOutputTest;
  }),
  AudioInputTest: {
    Events: {
      End: 'end',
      Error: 'error',
      Volume: 'volume',
    },
  },
  AudioOutputTest: {
    Events: {
      End: 'end',
      Error: 'error',
      Volume: 'volume',
    },
  },
}));

jest.mock('../../../../utils', () => ({
  getAudioLevelPercentage: (value: number) => value,

  // Just returns the first value for easier mocking
  getStandardDeviation: (values: number[]) => values[0],
}));

describe('the useAudioTest hook', () => {
  describe('output test', () => {
    it('should have correct states after starting the test', () => {
      const { result } = renderHook(useAudioTest);
      expect(result.current.isAudioOutputTestRunning).toBeFalsy();
      act(() => result.current.playAudio({}));
      expect(result.current.isAudioOutputTestRunning).toBeTruthy();
    });

    it('should update audio levels', () => {
      const { result } = renderHook(useAudioTest);
      expect(result.current.outputLevel).toEqual(0);
      act(() => {
        result.current.playAudio({});
        mockAudioOutputTest.emit('volume', 20);
      });

      expect(result.current.outputLevel).toEqual(20);
    });

    describe('when error happens', () => {
      it('should use default message', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.playAudio({});
          mockAudioOutputTest.emit('error');
        });
        expect(result.current.error).toEqual('An unknown error has occurred');
      });

      it('should use domError message', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.playAudio({});
          mockAudioOutputTest.emit('error', {
            domError: {
              toString: () => 'dom error',
            },
          });
        });
        expect(result.current.error).toEqual('dom error');
      });

      it('should use error message if dom error is not available', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.playAudio({});
          mockAudioOutputTest.emit('error', {
            message: 'error message',
          });
        });
        expect(result.current.error).toEqual('error message');
      });
    });

    describe('when test ends', () => {
      let result: RenderResult<any>;

      beforeEach(() => {
        result = renderHook(useAudioTest).result;
        act(() => result.current.playAudio({}));
      });

      it('should reset states', () => {
        expect(result.current.isAudioOutputTestRunning).toBeTruthy();
        act(() => {
          mockAudioOutputTest.emit('volume', 20);
          mockAudioOutputTest.emit('end', { values: [] });
        });
        expect(result.current.isAudioOutputTestRunning).toBeFalsy();
        expect(result.current.outputLevel).toEqual(0);
      });

      it('should set error when no audio detected', () => {
        act(() => {
          mockAudioOutputTest.emit('end', { values: [0, 0, 0, 0] });
        });
        expect(result.current.error).toEqual('No audio detected');
      });

      it('should not set error when audio levels are normal', () => {
        act(() => {
          mockAudioOutputTest.emit('end', { values: [10, 11, 11, 10] });
        });
        expect(result.current.error).toEqual('');
      });

      it('should save the report to the AppStateProvider', () => {
        act(() => {
          mockAudioOutputTest.emit('end', { values: [10, 11, 11, 10] });
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'set-audio-output-test-report',
          report: { values: [10, 11, 11, 10] },
        });
      });
    });
  });

  describe('input test', () => {
    it('should stop existing passive test', () => {
      const { result } = renderHook(useAudioTest);
      act(() => result.current.readAudioInput({}));
      expect(mockAudioInputTest.stop).not.toHaveBeenCalled();

      const previousMockAudioInputTest = mockAudioInputTest;
      act(() => result.current.readAudioInput({}));
      expect(previousMockAudioInputTest.stop).toHaveBeenCalled();
    });

    it('should have correct states after starting a passive test', () => {
      const { result } = renderHook(useAudioTest);
      expect(result.current.isRecording).toBeFalsy();
      expect(result.current.isAudioInputTestRunning).toBeFalsy();

      act(() => result.current.readAudioInput({}));

      expect(result.current.isRecording).toBeFalsy();
      expect(result.current.isAudioInputTestRunning).toBeTruthy();
    });

    it('should have correct states after starting a recording test', () => {
      const { result } = renderHook(useAudioTest);
      act(() => {
        result.current.playAudio({});
        mockAudioOutputTest.emit('end', { values: [] });
      });
      expect(result.current.isRecording).toBeFalsy();

      act(() => result.current.readAudioInput({ enableRecording: true }));
      expect(result.current.isRecording).toBeTruthy();
    });

    it('should update audio levels', () => {
      const { result } = renderHook(useAudioTest);
      expect(result.current.inputLevel).toEqual(0);
      act(() => {
        result.current.readAudioInput({});
        mockAudioInputTest.emit('volume', 20);
      });

      expect(result.current.inputLevel).toEqual(20);
    });

    describe('when error happens', () => {
      it('should use default message', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.readAudioInput({});
          mockAudioInputTest.emit('error');
        });
        expect(result.current.error).toEqual('An unknown error has occurred');
      });

      it('should use domError message', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.readAudioInput({});
          mockAudioInputTest.emit('error', {
            domError: {
              toString: () => 'dom error',
            },
          });
        });
        expect(result.current.error).toEqual('dom error');
      });

      it('should use error message if dom error is not available', () => {
        const { result } = renderHook(useAudioTest);
        expect(result.current.error).toEqual('');
        act(() => {
          result.current.readAudioInput({});
          mockAudioInputTest.emit('error', {
            message: 'error message',
          });
        });
        expect(result.current.error).toEqual('error message');
      });
    });

    describe('when test ends', () => {
      let result: RenderResult<any>;

      beforeEach(() => {
        result = renderHook(useAudioTest).result;
        act(() => result.current.readAudioInput({ enableRecording: true }));
      });

      it('should reset states', () => {
        expect(result.current.isRecording).toBeTruthy();
        expect(result.current.isAudioInputTestRunning).toBeTruthy();
        act(() => {
          mockAudioInputTest.emit('end', {});
        });
        expect(result.current.isRecording).toBeFalsy();
        expect(result.current.isAudioInputTestRunning).toBeFalsy();
      });

      it('should not set playback URI if not available', () => {
        expect(result.current.playbackURI).toEqual('');
        act(() => {
          mockAudioInputTest.emit('end', {});
        });
        expect(result.current.playbackURI).toEqual('');
      });

      it('should set playback URI if available', () => {
        expect(result.current.playbackURI).toEqual('');
        act(() => {
          mockAudioInputTest.emit('end', { recordingUrl: 'foo' });
        });
        expect(result.current.playbackURI).toEqual('foo');
      });

      it('should save the report to the AppStateProvider', () => {
        const mockReport = {};
        act(() => {
          mockAudioInputTest.emit('end', mockReport);
        });

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-audio-input-test-report', report: mockReport });
      });
    });
  });

  describe('the stopAudioTest function', () => {
    it('should stop the audio input test and audio out put test', () => {
      const { result } = renderHook(useAudioTest);

      result.current.stopAudioTest();

      expect(mockAudioInputTest.stop).toHaveBeenCalled();
      expect(result.current.inputLevel).toBe(0);
      expect(mockAudioOutputTest.stop).toHaveBeenCalled();
      expect(result.current.outputLevel).toBe(0);
    });
  });
});
