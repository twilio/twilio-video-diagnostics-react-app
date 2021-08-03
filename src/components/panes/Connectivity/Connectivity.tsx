import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { Loading } from '../../../icons/Loading';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';

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
  loading: {
    animation: '$loading 1.5s linear infinite',
    display: 'flex',
  },
  '@keyframes loading': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

export function Connectivity() {
  const { state } = useAppStateContext();
  const classes = useStyles();

  const twilioServicesStatus = state.twilioStatus === 'operational' ? 'Up' : 'Down';
  const signalingGateway = state.preflightTest.signalingGatewayReachable ? 'Reachable' : 'Unreachable';
  const turnServers = state.preflightTest.turnServersReachable ? 'Reachable' : 'Unreachable';

  const connectionFailed =
    twilioServicesStatus !== 'Up' || (state.preflightTestFinished && state.preflightTest.error !== null);

  return (
    // If preflight test hasn't completed, display loading screen otherwise, display connectivity results:
    <>
      {state.preflightTestInProgress ? (
        <Container>
          <Grid container className={classes.container}>
            <Typography variant="h1" gutterBottom>
              Hang Tight!
            </Typography>
            <Typography variant="body1" gutterBottom className={classes.textBox}>
              We're just finishing up your personalized results and creating your report.
            </Typography>
            <div className={classes.loading}>
              <Loading />
            </div>
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
