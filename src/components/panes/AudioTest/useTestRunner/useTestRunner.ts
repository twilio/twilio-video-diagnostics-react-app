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
import {
  APP_NAME,
  AUDIO_LEVEL_STANDARD_DEVIATION_THRESHOLD,
  INPUT_TEST_DURATION,
  RECORD_DURATION,
} from '../../../../constants';

const log = getLogger(APP_NAME);
let audioInputTest: AudioInputTest;

const getErrorMessage = (error: DiagnosticError) => {
  let message = 'An unknown error has occurred';
  if (error) {
    message = error.domError ? error.domError.toString() : error.message;
  }
  return message;
};

export default function useTestRunner() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioInputTestRunning, setIsAudioInputTestRunning] = useState(false);
  const [isAudioOutputTestRunning, setIAudioOutputTestRunning] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [playbackURI, setPlaybackURI] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [testEnded, setTestEnded] = useState(false);

  const playAudio = useCallback((options: AudioOutputTest.Options) => {
    log.debug('AudioOutputTest running');

    options = { doLoop: false, ...options };
    const audioOutputTest = testAudioOutputDevice(options);
    setIAudioOutputTestRunning(true);
    setTestEnded(false);
    setWarning('');

    audioOutputTest.on(AudioOutputTest.Events.Volume, (value: number) => {
      setOutputLevel(getAudioLevelPercentage(value));
    });

    audioOutputTest.on(AudioOutputTest.Events.End, (report: AudioOutputTest.Report) => {
      setIAudioOutputTestRunning(false);
      setTestEnded(true);
      setOutputLevel(0);

      const stdDev = getStandardDeviation(report.values);
      if (stdDev === 0) {
        setError('No audio detected');
      } else if (stdDev < AUDIO_LEVEL_STANDARD_DEVIATION_THRESHOLD) {
        setWarning('Low audio levels detected');
      }

      log.debug('AudioOutputTest ended', report);
    });

    audioOutputTest.on(AudioOutputTest.Events.Error, (diagnosticError: DiagnosticError) => {
      log.debug('error', diagnosticError);
      setError(getErrorMessage(diagnosticError));
    });
  }, []);

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
        setTestEnded(false);
        setIsRecording(true);
        setWarning('');
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
    [playbackURI]
  );

  const stopAudioTest = useCallback(() => {
    if (audioInputTest) {
      audioInputTest.stop();
    }
  }, []);

  return {
    error,
    warning,
    inputLevel,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    outputLevel,
    playAudio,
    playbackURI,
    readAudioInput,
    stopAudioTest,
    testEnded,
  };
}
