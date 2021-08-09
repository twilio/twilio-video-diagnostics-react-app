import React, { useCallback } from 'react';
import { ACTIONTYPE } from '../AppStateProvider';
import axios from 'axios';

const BASE_URL = 'https://status.twilio.com/api/v2/components.json';

export default function useTwilioStatus(dispatch: React.Dispatch<ACTIONTYPE>) {
  const getTwilioStatus = useCallback(() => {
    return axios(BASE_URL)
      .then((response) => {
        const twilioVideoComponent = response.data.components.filter(
          (componentObj: any) => componentObj.name === 'PROGRAMMABLE VIDEO'
        );

        const status = twilioVideoComponent[0].status;
        dispatch({ type: 'set-twilio-status', status });
      })

      .catch((error) => {
        dispatch({ type: 'set-twilio-status-error', error });
      });
  }, [dispatch]);

  return { getTwilioStatus } as const;
}
