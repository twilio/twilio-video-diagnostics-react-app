import { useCallback, useRef } from 'react';
import axios from 'axios';
import { testMediaConnectionBitrate, MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';
import { ACTIONTYPE } from '../AppStateProvider';

export default function useBitrateTest(dispatch: React.Dispatch<ACTIONTYPE>) {
  const bitrateTestRef = useRef<MediaConnectionBitrateTest>();
  const startBitrateTest = useCallback(() => {
    //Don't start a new bitrate test if one is already running:
    if (bitrateTestRef.current) {
      return;
    }

    dispatch({ type: 'bitrate-test-started' });

    return axios('app/turn-credentials')
      .then((response) => {
        const bitrateTest = testMediaConnectionBitrate({ iceServers: response.data.iceServers });

        bitrateTestRef.current = bitrateTest;

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
