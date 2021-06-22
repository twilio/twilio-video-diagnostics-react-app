import React from 'react';
import { Button, Container, Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import SettingsIllustration from './SettingsIllustration.png';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles({
  heading: {
    marginTop: '12px',
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
  illustration: {
    height: '181px',
    width: '342px',
  },
});

export function CheckPermissions() {
  const classes = useStyles();
  const { setActivePane, setDeviceError } = useAppStateContext();

  const handleClick = async () => {
    // get audio and video permissions then stop the tracks
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          setActivePane(ActivePane.Connectivity);
        });
      });
    } catch (error) {
      setDeviceError(error);
      setActivePane(ActivePane.DeviceError);
    }
  };
  return (
    <Container>
      <Grid container alignItems="center" justify="space-between">
        <Grid item md={6}>
          <Typography variant="h1" gutterBottom className={classes.heading}>
            Check permissions
          </Typography>

          <Typography variant="body1" gutterBottom>
            If you haven't already, you'll see a pop-up to grant Twilio permissions to access your camera and
            microphone.
            <strong>
              <span style={{ marginTop: '20px', display: 'inline-block' }}>
                Allow all permissions and re-fresh this page.
              </span>
            </strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={handleClick}>
            Refresh page
          </Button>
        </Grid>

        <Grid item md={5}>
          <Paper className={classes.paper}>
            <Typography variant="body1" className={classes.grantPermissions}>
              <strong>Grant permissions</strong>
            </Typography>
            {/* 
        The size of the image is explicitly stated here so that this content can properly be centered vertically
        before the image is loaded.
        */}
            <img src={SettingsIllustration} alt="Settings Illustration" className={classes.illustration} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
