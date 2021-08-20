import React from 'react';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { Button, Container, Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import ErrorIllustration from './ErrorIllustration.png';
import { ErrorIcon } from '../../../../icons/ErrorIcon';

const useStyles = makeStyles({
  heading: {
    position: 'relative',
    marginTop: '20px',
  },
  paper: {
    display: 'inline-block',
    padding: '23px',
    borderRadius: '8px',
  },
  grantPermissions: {
    fontSize: '16px',
    paddingBottom: '16px',
  },
  /* The size of the image is explicitly stated here so that this content can properly be centered vertically
  before the image is loaded.*/
  illustration: {
    height: '181px',
    width: '342px',
  },
  errorIcon: {
    position: 'absolute',
    right: 'calc(100% + 18px)',
  },
});

export function getDeviceErrorPaneContent(error?: Error) {
  let headline = '';
  let message = '';

  switch (true) {
    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === 'NotAllowedError':
      headline = 'Permissions needed';

      if (error!.message === 'Permission denied by system') {
        // Chrome only
        message =
          'The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.';
      } else {
        message = `We can't access your microphone/camera which means we don't have permissions for audio, video, and screen-sharing. Depending on your browser or operating system, these might live in "Settings".`;
      }

      break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === 'NotFoundError':
      headline = 'Cannot find microphone or camera';
      message =
        'The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.';
      break;

    // Other getUserMedia errors are less likely to happen in this app. Here we will display
    // the system's error message directly to the user.
    case Boolean(error):
      headline = 'Error acquiring media';
      message = `${error!.name} ${error!.message}`;
      break;
  }
  return {
    headline,
    message,
  };
}

export function PermissionError() {
  const { state } = useAppStateContext();
  const { headline, message } = getDeviceErrorPaneContent(state.deviceError!);
  const classes = useStyles();

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item md={6}>
          <Typography variant="h1" gutterBottom className={classes.heading}>
            <div className={classes.errorIcon}>
              <ErrorIcon />
            </div>{' '}
            {headline}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {message}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Update your settings to allow your browser permissions and refresh this page.</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </Grid>

        <Grid item md={5}>
          <Paper className={classes.paper}>
            <Typography variant="body1" className={classes.grantPermissions}>
              <strong>Permissions</strong>
            </Typography>
            <img src={ErrorIllustration} alt="Settings Illustration" className={classes.illustration} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
