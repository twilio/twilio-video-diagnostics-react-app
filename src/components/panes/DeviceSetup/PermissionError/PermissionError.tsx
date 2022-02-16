import React from 'react';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { Button, Container, Grid, Typography, Paper, makeStyles, Theme, createStyles } from '@material-ui/core';
import ErrorIllustration from './ErrorIllustration.png';
import { ErrorIcon } from '../../../../icons/ErrorIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      display: 'block',
    },
    heading: {
      position: 'relative',
      marginTop: '20px',
      [theme.breakpoints.between(1025, 1160)]: {
        marginLeft: '0.8em',
      },
    },
    grantPermissions: {
      fontSize: '16px',
      paddingBottom: '16px',
    },
    /* The size of the image is explicitly stated here so that this content can properly be centered vertically
  before the image is loaded.*/
    illustration: {
      maxHeight: '174px',
      maxWidth: '337px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    errorIcon: {
      position: 'absolute',
      right: 'calc(100% + 15px)',
      [theme.breakpoints.down('md')]: {
        position: 'relative',
        right: '0',
        marginBottom: '0.5em',
      },
    },
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    refreshButton: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
    paperContainer: {
      float: 'right',
      marginRight: '1em',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
    paper: {
      display: 'inline-block',
      padding: '20px',
      borderRadius: '8px',
    },
  })
);

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
        message = `We can't access your microphone/camera which means we don't have permissions for audio and video. Depending on your browser or operating system, these might live in "Settings".`;
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
      <div className={classes.mainContainer}>
        <Grid item lg={5} className={classes.header}>
          <Typography variant="h1" gutterBottom className={classes.heading}>
            <div className={classes.errorIcon}>
              <ErrorIcon />
            </div>{' '}
            {headline}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {message}
          </Typography>
        </Grid>

        <Grid item lg={5} className={classes.paperContainer}>
          <Paper className={classes.paper}>
            <Typography variant="body1" className={classes.grantPermissions}>
              <strong>Permissions</strong>
            </Typography>
            <img src={ErrorIllustration} alt="Settings Illustration" className={classes.illustration} />
          </Paper>
        </Grid>

        <Grid item lg={5} className={classes.refreshButton}>
          <Typography variant="body1" gutterBottom>
            <strong>Update your settings to allow your browser permissions and refresh this page.</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </Grid>
      </div>
    </Container>
  );
}
