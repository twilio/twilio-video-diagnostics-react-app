import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { createStyles, makeStyles, Button, Container, Grid, Typography, Paper } from '@material-ui/core';
import { DownloadIcon } from '../../../../icons/DownloadIcon';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: '1.5em',
      borderRadius: '8px',
    },
    paperContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    errorIcon: {
      position: 'absolute',
      right: 'calc(100% + 18px)',
    },
    downloadButton: {
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
    viewButton: {
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
  })
);

interface ConnectionFailedProps {
  openModal: () => void;
}

export function ConnectionFailed({ openModal }: ConnectionFailedProps) {
  const classes = useStyles();
  const { downloadFinalTestResults } = useAppStateContext();

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={5}>
            <Typography variant="h1" gutterBottom style={{ position: 'relative' }}>
              <div className={classes.errorIcon}>
                <ErrorIcon />
              </div>
              Connection failed
            </Typography>

            <Typography variant="body1" gutterBottom>
              It's possible that you're behind a firewall that will need to be updated by your network administrator.
            </Typography>

            <Typography variant="body1">
              Download report results to send to your network admin, update your internet, and re-run this test.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={downloadFinalTestResults}
              className={classes.downloadButton}
            >
              <DownloadIcon />
              Download report results
            </Button>
            <Typography variant="body2">
              <br />
            </Typography>
          </Grid>

          <Grid item md={5} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="body1" gutterBottom>
                To conduct a video call, your internet needs to be able to communicate with Twilio's cloud.
              </Typography>

              <Typography variant="body1">
                Learn{' '}
                <a href="https://www.twilio.com/docs/video/ip-addresses" target="_blank" rel="noopener noreferrer">
                  how to configure your firewall correctly
                </a>
                .
              </Typography>
            </Paper>
            <Button variant="outlined" onClick={openModal} className={classes.viewButton}>
              <ViewIcon />
              View detailed connection information
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
