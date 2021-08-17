import { useState, useCallback } from 'react';
import { getLogger } from 'loglevel';
import {
  AudioInputTest,
  AudioOutputTest,
  DiagnosticError,
  testAudioInputDevice,
  testAudioOutputDevice,
  WarningName,
} from '@twilio/rtc-diagnostics';

import { getAudioLevelPercentage, getStandardDeviation } from '../../../../utils';
import { APP_NAME, INPUT_TEST_DURATION, RECORD_DURATION } from '../../../../constants';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const log = getLogger(APP_NAME);
let audioInputTest: AudioInputTest;
let audioOutputTest: AudioOutputTest;

const getErrorMessage = (error: DiagnosticError) => {
  let message = 'An unknown error has occurred';
  if (error) {
    message = error.domError ? error.domError.toString() : error.message;
  }
  return message;
};

export default function useAudioTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioInputTestRunning, setIsAudioInputTestRunning] = useState(false);
  const [isAudioOutputTestRunning, setIsAudioOutputTestRunning] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [playbackURI, setPlaybackURI] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useAppStateContext();

  const playAudio = useCallback(
    (options: AudioOutputTest.Options) => {
      log.debug('AudioOutputTest running');

      options = { doLoop: false, ...options };
      audioOutputTest = testAudioOutputDevice(options);
      setIsAudioOutputTestRunning(true);

      audioOutputTest.on(AudioOutputTest.Events.Volume, (value: number) => {
        setOutputLevel(getAudioLevelPercentage(value));
      });

      audioOutputTest.on(AudioOutputTest.Events.End, (report: AudioOutputTest.Report) => {
        setIsAudioOutputTestRunning(false);
        setOutputLevel(0);

        const stdDev = getStandardDeviation(report.values);
        if (stdDev === 0) {
          setError('No audio detected');
        }
        log.debug('AudioOutputTest ended', report);
        dispatch({ type: 'set-audio-output-test-report', report: report });
      });

      audioOutputTest.on(AudioOutputTest.Events.Error, (diagnosticError: DiagnosticError) => {
        log.debug('error', diagnosticError);
        setError(getErrorMessage(diagnosticError));
      });
    },
    [dispatch]
  );

  const readAudioInput = useCallback(
    (options: AudioInputTest.Options) => {
      if (audioInputTest) {
        audioInputTest.stop();
      }

      log.debug('AudioInputTest running');
      const duration = options.enableRecording ? RECORD_DURATION : INPUT_TEST_DURATION;
      options = { duration, ...options };
      audioInputTest = testAudioInputDevice(options);

      setIsAudioInputTestRunning(true);
      if (options.enableRecording) {
        log.debug('Recording audio');
        setIsRecording(true);
      }

      audioInputTest.on(AudioInputTest.Events.Volume, (value: number) => {
        setInputLevel(getAudioLevelPercentage(value));
      });

      audioInputTest.on(AudioInputTest.Events.End, (report: AudioInputTest.Report) => {
        if (playbackURI && report.recordingUrl) {
          URL.revokeObjectURL(playbackURI);
        }

        if (report.recordingUrl) {
          setPlaybackURI(report.recordingUrl);
        }

        setIsRecording(false);
        setIsAudioInputTestRunning(false);
        log.debug('AudioInputTest ended', report);
        dispatch({ type: 'set-audio-input-test-report', report: report });
      });

      audioInputTest.on(AudioInputTest.Events.Error, (diagnosticError: DiagnosticError) => {
        log.debug('error', diagnosticError);
        setError(getErrorMessage(diagnosticError));
      });
      audioInputTest.on(AudioInputTest.Events.Warning, (name: WarningName) => {
        log.debug('warning', name);
      });
      audioInputTest.on(AudioInputTest.Events.WarningCleared, (name: WarningName) => {
        log.debug('warning-cleared', name);
      });
    },
    [playbackURI, dispatch]
  );

  const stopAudioTest = useCallback(() => {
    if (audioInputTest) {
      audioInputTest.stop();
      setInputLevel(0);
    }
    if (audioOutputTest) {
      audioOutputTest.stop();
      setOutputLevel(0);
    }
  }, []);

  return {
    error,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    playAudio,
    playbackURI,
    readAudioInput,
    stopAudioTest,
    inputLevel,
    outputLevel,
  };
}
