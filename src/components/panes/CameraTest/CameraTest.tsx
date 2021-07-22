import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Container,
  FormControl,
  makeStyles,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { useCameraTest } from './useCameraTest/useCameraTest';
import useDevices from '../../../hooks/useDevices/useDevices';

const useStyles = makeStyles({
  paper: {
    padding: '2em',
    borderRadius: '8px',
  },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  aspectRatioContainer: {
    position: 'relative',
    display: 'flex',
    width: '80%',
    padding: '1em',
    margin: '1em 0',
    '&::after': {
      content: '""',
      paddingTop: '56.25%',
    },
    '& video': {
      position: 'absolute',
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  disablePointerEvent: {
    pointerEvents: 'none',
  },
});

export function CameraTest() {
  const classes = useStyles();
  const { videoInputDevices } = useDevices();
  const { state, dispatch } = useAppStateContext();
  const { videoElementRef, startVideoTest, stopVideoTest, videoTest } = useCameraTest();

  const prevVideoDeviceID = useRef('');
  const [videoInputDeviceID, setVideoInputDeviceID] = useState('');

  const setDevice = (deviceID: string) => {
    setVideoInputDeviceID(deviceID);
  };

  useEffect(() => {
    // Stop the test when we are not on the CameraTest pane and there is an active test
    if (state.activePane !== ActivePane.CameraTest && videoTest) {
      stopVideoTest();
      prevVideoDeviceID.current = '';
    }
  }, [state.activePane, stopVideoTest, videoTest]);

  useEffect(() => {
    // Start the test when we are on the CameraTest pane and when the videoInputDeviceID changes
    if (state.activePane === ActivePane.CameraTest) {
      const newDeviceSelected = prevVideoDeviceID.current !== videoInputDeviceID;
      prevVideoDeviceID.current = videoInputDeviceID;

      if (videoInputDeviceID && newDeviceSelected) {
        startVideoTest(videoInputDeviceID);
      }
    }
  }, [state.activePane, videoInputDeviceID, startVideoTest, stopVideoTest]);

  useEffect(() => {
    // If no device is select, set the first available device as the active device.
    const hasSelectedDevice = videoInputDevices.some((device) => device.deviceId === videoInputDeviceID);
    if (videoInputDevices.length && !hasSelectedDevice) {
      setVideoInputDeviceID(videoInputDevices[0].deviceId);
    }
  }, [videoInputDevices, videoInputDeviceID]);

  return (
    <Container>
      <Grid container alignItems="center" justify="space-between">
        <Grid item md={5}>
          <Typography variant="h1" gutterBottom>
            Check your video
          </Typography>

          <Typography variant="body1" gutterBottom>
            Double check that you're using the correct camera. If you don't see your video, try changing the camera or
            restarting your device.
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Does your camera look ok?</strong>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: 'next-pane' })}
            style={{ marginRight: '1.5em' }}
          >
            Yes
          </Button>
          <Button color="primary" onClick={() => dispatch({ type: 'next-pane' })}>
            Skip for now
          </Button>
        </Grid>

        <Grid item md={5}>
          <Paper className={classes.paper}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="subtitle2">
                <strong>Video Preview</strong>
              </Typography>
              <div className={classes.aspectRatioContainer}>
                <video ref={videoElementRef} />
              </div>
            </Grid>
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                <strong>Camera</strong>
              </Typography>
              <Select
                onChange={(e) => setDevice(e.target.value as string)}
                value={videoInputDeviceID}
                variant="outlined"
                // disable ability to switch video devices when not actively testing camera:
                className={clsx({ [classes.disablePointerEvent]: state.activePane !== ActivePane.CameraTest })}
              >
                {videoInputDevices.map((device) => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
