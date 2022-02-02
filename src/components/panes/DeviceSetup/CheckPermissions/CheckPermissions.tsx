import React from 'react';
import { Button, Container, Grid, Typography, Paper, makeStyles, Hidden, Theme, createStyles } from '@material-ui/core';
import SettingsIllustration from './SettingsIllustration.png';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: 'inline-block',
      padding: '23px',
      borderRadius: '8px',
    },
    grantPermissions: {
      fontSize: '16px',
      paddingBottom: '16px',
    },
    /* 
  The size of the image is explicitly stated here so that this content can properly be centered vertically
  before the image is loaded.
  */
    illustration: {
      height: '181px',
      width: '337px',
      [theme.breakpoints.down('sm')]: {
        height: '147px',
        width: '278px',
      },
    },
    gridContainer: {
      [theme.breakpoints.only('md')]: {
        marginLeft: '3em',
        width: '70%',
      },
    },
    requestButton: {
      [theme.breakpoints.down('sm')]: {
        marginBottom: '2em',
      },
    },
  })
);

export function CheckPermissions() {
  const classes = useStyles();
  const { dispatch } = useAppStateContext();

  const handleClick = async () => {
    try {
      // get audio and video permissions then stop the tracks
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(async (mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      });
      // The devicechange event is not fired after permissions are granted, so we fire it
      // ourselves to update the useDevices hook. The 100 ms delay is needed so that device labels are available
      // when the useDevices hook updates.
      setTimeout(() => navigator.mediaDevices.dispatchEvent(new Event('devicechange')), 500);
      dispatch({ type: 'next-pane' });
    } catch (error) {
      dispatch({ type: 'set-device-error', error });
    }
  };

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between" className={classes.gridContainer}>
        <Grid item lg={6}>
          <Typography variant="h1" gutterBottom>
            Check permissions
          </Typography>

          <Typography variant="body1" gutterBottom>
            If you haven't already, you'll see a pop-up to grant Twilio permissions to access your camera and
            microphone.
          </Typography>
          <Hidden lgUp>
            <Paper className={classes.paper} style={{ marginBottom: '2.5em' }}>
              <Typography variant="body1" className={classes.grantPermissions}>
                <strong>Grant permissions</strong>
              </Typography>
              <img src={SettingsIllustration} alt="Settings Illustration" className={classes.illustration} />
            </Paper>
          </Hidden>
          <Typography variant="body1" gutterBottom>
            <strong>Allow all permissions and refresh this page.</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={handleClick} className={classes.requestButton}>
            Request permissions
          </Button>
        </Grid>

        <Hidden mdDown>
          <Grid item lg={5}>
            <Paper className={classes.paper}>
              <Typography variant="body1" className={classes.grantPermissions}>
                <strong>Grant permissions</strong>
              </Typography>
              <img src={SettingsIllustration} alt="Settings Illustration" className={classes.illustration} />
            </Paper>
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
}
