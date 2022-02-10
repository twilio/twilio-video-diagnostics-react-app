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
  Theme,
  createStyles,
} from '@material-ui/core';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { SmallError } from '../../../icons/SmallError';
import { useCameraTest } from './useCameraTest/useCameraTest';
import useDevices from '../../../hooks/useDevices/useDevices';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      display: 'block',
    },
    paper: {
      padding: '2em',
      borderRadius: '8px',
      maxWidth: '450px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
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
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    cameraTest: {
      float: 'right',
      marginRight: '1em',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
    confirmationButtons: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      margin: '0.5em 0',
      '& svg': {
        marginRight: '0.3em',
      },
    },
  })
);

export function CameraTest() {
  const classes = useStyles();
  const { videoInputDevices } = useDevices();
  const { state, dispatch } = useAppStateContext();
  const { videoElementRef, startVideoTest, stopVideoTest, videoTest, videoTestError } = useCameraTest();

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

      if (videoTestError) {
        stopVideoTest();
      }
    }
  }, [state.activePane, videoInputDeviceID, startVideoTest, stopVideoTest, videoTestError, dispatch]);

  useEffect(() => {
    // If no device is select, set the first available device as the active device.
    const hasSelectedDevice = videoInputDevices.some((device) => device.deviceId === videoInputDeviceID);
    if (videoInputDevices.length && !hasSelectedDevice) {
      setVideoInputDeviceID(videoInputDevices[0].deviceId);
    }
  }, [videoInputDevices, videoInputDeviceID]);

  return (
    <Container>
      <div className={classes.mainContainer}>
        <Grid item lg={5} className={classes.header}>
          <Typography variant="h1" gutterBottom>
            Check your video
          </Typography>
          <Typography variant="body1" gutterBottom>
            Move in front of your camera to make sure it's working. If you don't see your video, try changing the
            selected camera. If the camera isn't part of your computer, check your settings to make sure your system
            recognizes it.
          </Typography>
        </Grid>

        <Grid item lg={5} className={classes.cameraTest}>
          <Paper className={classes.paper}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="subtitle2">
                <strong>Video Preview</strong>
              </Typography>
              <div className={classes.aspectRatioContainer}>
                <video autoPlay playsInline ref={videoElementRef} />
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
                disabled={!!videoTestError}
              >
                {videoInputDevices.map((device) => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {videoTestError && (
              <div className={classes.error}>
                <SmallError />
                <Typography variant="subtitle2" color="error">
                  Unable to connect.
                </Typography>
              </div>
            )}
          </Paper>
        </Grid>

        <Grid item lg={5} className={classes.confirmationButtons}>
          <Typography variant="body1" gutterBottom>
            <strong>Does your video look ok?</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: 'next-pane' })}
            style={{ marginRight: '1.5em' }}
            disabled={!!videoTestError}
          >
            Yes
          </Button>
          <Button color="primary" onClick={() => dispatch({ type: 'next-pane' })} disabled={!!videoTestError}>
            Skip for now
          </Button>
        </Grid>
      </div>
    </Container>
  );
}
