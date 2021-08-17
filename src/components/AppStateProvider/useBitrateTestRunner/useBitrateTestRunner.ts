import { testMediaConnectionBitrate, MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';
import { getJSON } from '../../../utils';
import { ACTIONTYPE } from '../../AppStateProvider/AppStateProvider';

export default function useBitrateTestRunner(dispatch: React.Dispatch<ACTIONTYPE>) {
  const getTURNCredentials = () => {
    return getJSON('app/turn-credentials').then((res) => res.iceServers as RTCIceServer[]);
  };

  const startBitrateTest = async () => {
    const iceServers = await getTURNCredentials();

    const bitrateTest = testMediaConnectionBitrate({ iceServers: iceServers });

    dispatch({ type: 'bitrate-test-started' });

    bitrateTest.on(MediaConnectionBitrateTest.Events.Bitrate, (bitrate) => {
      dispatch({ type: 'set-bitrate', bitrate });
    });

    bitrateTest.on(MediaConnectionBitrateTest.Events.Error, (error) => {
      dispatch({ type: 'set-bitrate-test-error', error });
      dispatch({ type: 'bitrate-test-finished' });
    });

    bitrateTest.on(MediaConnectionBitrateTest.Events.End, (report) => {
      dispatch({ type: 'set-bitrate-test-report', report });
      dispatch({ type: 'bitrate-test-finished' });
    });

    setTimeout(() => {
      bitrateTest.stop();
    }, 15000);
  };

  return { startBitrateTest } as const;
}
