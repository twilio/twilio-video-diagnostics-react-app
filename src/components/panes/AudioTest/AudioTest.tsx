import React, { useEffect, useRef, useState } from 'react';
import { Button, Paper, Typography, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { AudioDevice } from './AudioDevice/AudioDevice';
import ProgressBar from './ProgressBar/ProgressBar';
import useTestRunner from './useTestRunner/useTestRunner';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { Microphone } from '../../../icons/Microphone';

const useStyles = makeStyles({
  paper: {
    display: 'inline-block',
    padding: '23px',
    borderRadius: '8px',
    height: '280px',
    width: '388px',
  },
  audioHeading: {
    fontSize: '16px',
  },
  audioLevelContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  topLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});

export default function AudioDeviceTestWidget() {
  const classes = useStyles();
  const [inputDeviceId, setInputDeviceId] = useState('');
  const [outputDeviceId, setOutputDeviceId] = useState('');
  const previousInputDeviceIdRef = useRef('');
  const { state, dispatch } = useAppStateContext();

  const {
    error,
    inputLevel,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    playAudio,
    playbackURI,
    readAudioInput,
    stopAudioTest,
  } = useTestRunner();

  const disableAll = isRecording || isAudioOutputTestRunning || !!error;

  const handleRecordClick = () => {
    readAudioInput({ deviceId: inputDeviceId, enableRecording: true });
  };

  const handlePlayClick = () => {
    playAudio({ deviceId: outputDeviceId, testURI: playbackURI });
  };

  useEffect(() => {
    if (state.activePane === ActivePane.Connectivity) {
      const newDeviceSelected = previousInputDeviceIdRef.current !== inputDeviceId;
      previousInputDeviceIdRef.current = inputDeviceId;

      // Restarts the test to continuously capture audio input
      if (!error && (newDeviceSelected || (!isRecording && !isAudioInputTestRunning))) {
        readAudioInput({ deviceId: inputDeviceId });
      }
    } else {
      stopAudioTest();
    }
  }, [error, inputDeviceId, isRecording, isAudioInputTestRunning, readAudioInput, state.activePane, stopAudioTest]);

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item md={6}>
          <Typography variant="h1" gutterBottom>
            Test your audio
          </Typography>
          ​
          <Typography variant="body1" gutterBottom>
            Record an audio clip and play it back to check that your speakers and volume control both work. If it
            doesn’t, try a different speaker or check your Bluetooth settings.
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong> Does your audio sound good?</strong>
          </Typography>
          ​
          <div style={{ display: 'flex' }}>
            <Button
              variant="contained"
              style={{ marginRight: '1.5em' }}
              color="primary"
              onClick={() => dispatch({ type: 'next-pane' })}
            >
              Yes
            </Button>

            <Button color="primary" onClick={() => dispatch({ type: 'next-pane' })}>
              Skip for now
            </Button>
          </div>
        </Grid>
        ​
        <Grid item md={5}>
          <Paper className={classes.paper}>
            <div className={classes.topLine}>
              <Typography variant="body1" className={classes.audioHeading}>
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
            <AudioDevice disabled={disableAll} kind="audiooutput" onDeviceChange={setOutputDeviceId} />
            <AudioDevice disabled={disableAll} kind="audioinput" onDeviceChange={setInputDeviceId} />
            <div className={classes.audioLevelContainer}>
              <div style={{ margin: '0 0.5em' }}>
                <Microphone />
              </div>
              <ProgressBar position={inputLevel} duration={0.1} style={{ flex: '1' }} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
