import { ActivePane, useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { createStyles, makeStyles, Button, Container, Grid, Typography, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useState } from 'react';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';
import { DownloadIcon } from '../../../../icons/DownloadIcon';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      width: '6000px',
    },
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
      background: 'white',
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
    disablePointerEvents: {
      pointerEvents: 'none',
    },
  })
);

interface ConnectionFailedProps {
  serviceStatus: string;
  signalingGateway: string;
  turnServers: string;
}

export function ConnectionFailed({ serviceStatus, signalingGateway, turnServers }: ConnectionFailedProps) {
  const classes = useStyles();
  const { nextPane, state } = useAppStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ConnectionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        serviceStatus={serviceStatus}
        signalingGateway={signalingGateway}
        turnServers={turnServers}
      />
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

            <Button variant="contained" color="primary" onClick={nextPane} className={classes.downloadButton}>
              <DownloadIcon />
              Download report results
            </Button>
          </Grid>

          <Grid item md={5} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="body1" gutterBottom>
                To conduct a video call, your internet needs to be able to communicate with Twilio's cloud.
              </Typography>

              <Typography variant="body1">Learn how to configure your firewall correctly.</Typography>
            </Paper>
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(true)}
              className={clsx(classes.viewButton, {
                [classes.disablePointerEvents]: state.activePane !== ActivePane.Connectivity,
              })}
            >
              <ViewIcon />
              View detailed connection information
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
