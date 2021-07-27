import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';

export function Connectivity() {
  const { state } = useAppStateContext();

  const twilioServicesStatus = state.twilioStatus === 'operational' ? 'Up' : 'Down';
  const signalingGateway = state.preflightTest.progress === 'connected' ? 'Unreachable' : 'Reachable';
  const turnServers = state.preflightTest.progress === 'mediaStarted' ? 'Unreachable' : 'Reachable';

  // If any of the above are Unreachable or Down, connection has failed:
  const connectionFailed = twilioServicesStatus !== 'Up' || state.preflightTest.progress;

  return (
    <>
      {connectionFailed ? (
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
