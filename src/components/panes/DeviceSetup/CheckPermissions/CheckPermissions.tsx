import React from 'react';
import { Button, Container, Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import SettingsIllustration from './SettingsIllustration.png';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles({
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
    width: '342px',
  },
});

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
      dispatch({ type: 'next-pane' });
    } catch (error) {
      dispatch({ type: 'set-device-error', error });
    }
  };

  return (
    <Container>
      <Grid container alignItems="center" justify="space-between">
        <Grid item md={6}>
          <Typography variant="h1" gutterBottom>
            Check permissions
          </Typography>

          <Typography variant="body1" gutterBottom>
            If you haven't already, you'll see a pop-up to grant Twilio permissions to access your camera and
            microphone.
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Allow all permissions and re-fresh this page.</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={handleClick}>
            Request permissions
          </Button>
        </Grid>

        <Grid item md={5}>
          <Paper className={classes.paper}>
            <Typography variant="body1" className={classes.grantPermissions}>
              <strong>Grant permissions</strong>
            </Typography>
            <img src={SettingsIllustration} alt="Settings Illustration" className={classes.illustration} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
