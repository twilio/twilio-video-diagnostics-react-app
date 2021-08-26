import { useEffect, useRef, useState } from 'react';
import { Button, Paper, Typography, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AudioDevice from './AudioDevice/AudioDevice';
import ProgressBar from './ProgressBar/ProgressBar';
import useAudioTest from './useAudioTest/useAudioTest';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import Microphone from '../../../icons/Microphone';
import Speaker from '../../../icons/SpeakerIcon';

const useStyles = makeStyles({
  paper: {
    display: 'inline-block',
    padding: '23px',
    borderRadius: '8px',
    minHeight: '280px',
    width: '388px',
  },
  audioLevelContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '2.5em',
  },
  topLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});

export function AudioTest() {
  const classes = useStyles();
  const [inputDeviceId, setInputDeviceId] = useState('');
  const [outputDeviceId, setOutputDeviceId] = useState('');
  const previousInputDeviceIdRef = useRef('');
  const { state, dispatch } = useAppStateContext();

  const {
    error,
    setError,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    playAudio,
    playbackURI,
    readAudioInput,
    stopAudioTest,
    inputLevel,
    outputLevel,
  } = useAudioTest();

  const volumeLevel = isAudioOutputTestRunning ? outputLevel : inputLevel;

  const disableAll = isRecording || isAudioOutputTestRunning || (!!error && error !== 'No audio detected');

  const handleRecordClick = () => {
    readAudioInput({ deviceId: inputDeviceId, enableRecording: true });
  };

  const handlePlayClick = () => {
    playAudio({ deviceId: outputDeviceId, testURI: playbackURI });
  };

  // stop test when not on AudioTest and there's an active test
  useEffect(() => {
    if (state.activePane !== ActivePane.AudioTest && (isAudioOutputTestRunning || isAudioInputTestRunning)) {
      stopAudioTest();
    }
  }, [state.activePane, stopAudioTest, isAudioInputTestRunning, isAudioOutputTestRunning]);

  // start audio test when on AudioTest and deviceId changes
  useEffect(() => {
    if (state.activePane === ActivePane.AudioTest) {
      const newInputDeviceSelected = previousInputDeviceIdRef.current !== inputDeviceId;
      previousInputDeviceIdRef.current = inputDeviceId;

      // Restarts the test to continuously capture audio input
      if (!error && (newInputDeviceSelected || (!isRecording && !isAudioInputTestRunning))) {
        readAudioInput({ deviceId: inputDeviceId });
      }
    }
    if (error) {
      stopAudioTest();
    }
  }, [
    error,
    state.activePane,
    inputDeviceId,
    isRecording,
    isAudioInputTestRunning,
    readAudioInput,
    dispatch,
    stopAudioTest,
  ]);

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item md={5}>
          <Typography variant="h1" gutterBottom>
            Test your audio
          </Typography>

          <Typography variant="body1" gutterBottom>
            Record an audio clip and play it back to check that your speakers and volume control both work. If it
            doesn’t, try a different speaker or microphone, or check your Bluetooth settings.
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong> Does your audio sound good?</strong>
          </Typography>

          <Button
            variant="contained"
            style={{ marginRight: '1.5em' }}
            color="primary"
            onClick={() => dispatch({ type: 'next-pane' })}
            disabled={!!error && error !== 'No audio detected'}
          >
            Yes
          </Button>

          <Button
            color="primary"
            onClick={() => dispatch({ type: 'next-pane' })}
            disabled={!!error && error !== 'No audio detected'}
          >
            Skip for now
          </Button>
        </Grid>
        ​
        <Grid item md={5}>
          <Paper className={classes.paper}>
            <div className={classes.topLine}>
              <Typography variant="subtitle2">
                <strong>Audio</strong>
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  style={{ marginRight: '1em' }}
                  size="small"
                  disabled={disableAll}
                  onClick={handleRecordClick}
                >
                  Record
                </Button>
                <Button variant="outlined" size="small" disabled={!playbackURI || disableAll} onClick={handlePlayClick}>
                  Play back
                </Button>
              </div>
            </div>
            ​
            <AudioDevice
              disabled={disableAll}
              kind="audiooutput"
              onDeviceChange={setOutputDeviceId}
              setDeviceError={setError}
            />
            <AudioDevice
              disabled={disableAll}
              kind="audioinput"
              onDeviceChange={setInputDeviceId}
              setDeviceError={setError}
              error={error}
            />
            <div className={classes.audioLevelContainer}>
              <div style={{ width: '2em', display: 'flex', justifyContent: 'center' }}>
                {isAudioOutputTestRunning ? <Speaker /> : <Microphone />}
              </div>
              <ProgressBar position={volumeLevel} duration={0.1} style={{ flex: '1' }} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
