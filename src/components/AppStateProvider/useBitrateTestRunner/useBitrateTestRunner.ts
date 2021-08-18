import { testMediaConnectionBitrate, MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';
import axios from 'axios';
import { useCallback } from 'react';
import { ACTIONTYPE } from '../../AppStateProvider/AppStateProvider';

export default function useBitrateTestRunner(dispatch: React.Dispatch<ACTIONTYPE>) {
  const startBitrateTest = useCallback(() => {
    return axios('app/turn-credentials')
      .then((response) => {
        const bitrateTest = testMediaConnectionBitrate({ iceServers: response.data.iceServers });

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
      })
      .catch((error) => {
        dispatch({ type: 'set-bitrate-test-error', error });
        dispatch({ type: 'bitrate-test-finished' });
      });
  }, [dispatch]);

  return { startBitrateTest } as const;
}
