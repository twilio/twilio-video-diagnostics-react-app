import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { Loading } from '../../../icons/Loading';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textBox: {
    width: '340px',
    height: '48px',
    textAlign: 'center',
  },
});

export function Connectivity() {
  const { state } = useAppStateContext();
  const classes = useStyles();

  const twilioServicesStatus = state.twilioStatus === 'operational' ? 'Up' : 'Down';
  const signalingGateway = state.preflightTest.progress === 'connected' ? 'Unreachable' : 'Reachable';
  const turnServers = state.preflightTest.progress === 'mediaStarted' ? 'Unreachable' : 'Reachable';

  const showLoading =
    state.activePane === ActivePane.Connectivity &&
    state.preflightTest.progress !== null &&
    state.preflightTest.error === null;

  const connectionFailed =
    twilioServicesStatus !== 'Up' || (state.preflightTest.progress && state.preflightTest.error !== null);

  return (
    // If preflight test hasn't completed, display loading screen otherwise, display connectivity results:
    <>
      {showLoading ? (
        <Container>
          <Grid container className={classes.container}>
            <Typography variant="h1" gutterBottom>
              Hang Tight!
            </Typography>
            <Typography variant="body1" gutterBottom className={classes.textBox}>
              We're just finishing up your personalized results and creating your report.
            </Typography>
            <Loading />
          </Grid>
        </Container>
      ) : connectionFailed ? (
        <ConnectionFailed
          serviceStatus={twilioServicesStatus}
          signalingGateway={signalingGateway}
          turnServers={turnServers}
        />
      ) : (
        <ConnectionSuccess serviceStatus="Up" signalingGateway="Reachable" turnServers="Reachable" />
      )}
    </>
  );
}
