import React, { useCallback, useRef } from 'react';
import { ACTIONTYPE } from '../AppStateProvider';
import axios from 'axios';
import { PreflightTest, runPreflight } from 'twilio-video';

export default function usePreflightTest(dispatch: React.Dispatch<ACTIONTYPE>) {
  const preflightTestRef = useRef<PreflightTest>();
  const startPreflightTest = useCallback(() => {
    // Don't start a new preflight test if one is already running
    if (preflightTestRef.current) {
      return;
    }

    return axios('/token')
      .then((response) => {
        dispatch({ type: 'preflight-started' });
        const preflightTest = runPreflight(response.data.token);

        preflightTestRef.current = preflightTest;

        preflightTest.on('progress', (progress) => {
          dispatch({ type: 'preflight-progress', progress });
        });

        preflightTest.on('completed', (report) => {
          dispatch({ type: 'preflight-completed', report });
          dispatch({ type: 'preflight-finished' });
        });

        preflightTest.on('failed', (error) => {
          dispatch({ type: 'preflight-failed', error });
          dispatch({ type: 'preflight-finished' });
        });
      })
      .catch((error) => {
        dispatch({ type: 'preflight-token-failed', error });
      });
  }, [dispatch]);

  return { startPreflightTest } as const;
}
