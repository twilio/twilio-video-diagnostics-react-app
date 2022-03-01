import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { createStyles, makeStyles, Button, Container, Grid, Typography, Paper } from '@material-ui/core';
import { DownloadIcon } from '../../../../icons/DownloadIcon';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    heading: {
      position: 'relative',
      marginTop: '20px',
    },
    errorIcon: {
      position: 'absolute',
      right: 'calc(100% + 15px)',
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
        right: '0',
        marginBottom: '0.5em',
      },
    },
    paperContainer: {
      float: 'right',
      marginRight: '1em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
    paper: {
      padding: '1.5em',
      borderRadius: '8px',
      maxWidth: '400px',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    downloadButton: {
      clear: 'left',
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
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
        <div>
          <Grid item lg={5} className={classes.header}>
            <Typography variant="h1" gutterBottom className={classes.heading}>
              <div className={classes.errorIcon}>
                <ErrorIcon />
              </div>
              Connection failed
            </Typography>

            <Typography variant="body1" gutterBottom>
              It's possible that you're behind a firewall that will need to be updated by your network administrator.
            </Typography>
          </Grid>

          <Grid item lg={5} className={classes.paperContainer}>
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

          <Grid item lg={5}>
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
          </Grid>
        </div>
      </Container>
    </>
  );
}
