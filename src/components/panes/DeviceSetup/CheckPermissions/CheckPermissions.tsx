import { Button, Container, Grid, Typography, Paper, makeStyles, Theme, createStyles } from '@material-ui/core';
import SettingsIllustration from './SettingsIllustration.png';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
        height: '100%',
        width: '100%',
      },
    },
    mainContainer: {
      display: 'block',
      [theme.breakpoints.only('md')]: {
        marginLeft: '3em',
        width: '70%',
      },
    },
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    requestButton: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
    paperContainer: {
      float: 'right',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        marginBottom: '2.5em',
      },
    },
    paper: {
      display: 'inline-block',
      padding: '23px',
      borderRadius: '8px',
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
      <div className={classes.mainContainer}>
        <Grid item lg={5} className={classes.header}>
          <Typography variant="h1" gutterBottom>
            Check permissions
          </Typography>
          <Typography variant="body1" gutterBottom>
            If you haven't already, you'll see a pop-up to grant Twilio permissions to access your camera and
            microphone.
          </Typography>
        </Grid>

        <Grid item lg={5} className={classes.paperContainer}>
          <Paper className={classes.paper}>
            <Typography variant="body1" className={classes.grantPermissions}>
              <strong>Grant permissions</strong>
            </Typography>
            <img src={SettingsIllustration} alt="Settings Illustration" className={classes.illustration} />
          </Paper>
        </Grid>

        <Grid item lg={5} className={classes.requestButton}>
          <Typography variant="body1" gutterBottom>
            <strong>Allow all permissions and refresh this page.</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={handleClick}>
            Request permissions
          </Button>
        </Grid>
      </div>
    </Container>
  );
}
