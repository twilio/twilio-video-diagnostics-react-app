import { ActivePane, useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { createStyles, makeStyles, Button, Container, Grid, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';
import Success from './Success.png';
import { useState } from 'react';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      width: '6000px',
    },
    illustrationContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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

interface ConnectionSuccessProps {
  serviceStatus: string;
  signalingGateway: string;
  turnServers: string;
}

export function ConnectionSuccess({ serviceStatus, signalingGateway, turnServers }: ConnectionSuccessProps) {
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
            <Typography variant="h1" gutterBottom>
              Connection success
            </Typography>

            <Typography variant="body1" gutterBottom>
              All connections to Twilio's servers are working correctly.
            </Typography>

            <Button variant="contained" color="primary" onClick={nextPane}>
              Ok
            </Button>
          </Grid>

          <Grid item md={5} className={classes.illustrationContainer}>
            {/* 
          The size of the image is explicitly stated here so that this content can properly be centered vertically
          before the image is loaded.
          */}
            <img src={Success} alt="Success" style={{ width: '245px', height: '200px' }} />
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
