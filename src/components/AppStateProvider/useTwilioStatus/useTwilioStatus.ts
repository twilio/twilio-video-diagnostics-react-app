import React, { useCallback } from 'react';
import { ACTIONTYPE, TwilioStatus, TwilioAPIStatus } from '../AppStateProvider';
import axios from 'axios';

const BASE_URL = 'https://status.twilio.com/api/v2/components.json';

export default function useTwilioStatus(dispatch: React.Dispatch<ACTIONTYPE>) {
  const getTwilioStatus = useCallback(() => {
    return axios(BASE_URL)
      .then((response) => {
        const statusObj: TwilioStatus = {};

        const ALLOWED_COMPONENTS = [
          'Group Rooms',
          'Peer-to-Peer Rooms',
          'Compositions',
          'Recordings',
          'Network Traversal Service',
          'Go Rooms',
        ];

        response.data.components.forEach(({ name, status }: { name: keyof TwilioStatus; status: TwilioAPIStatus }) => {
          if (ALLOWED_COMPONENTS.includes(name)) {
            statusObj[name] = status;
          }
        });

        dispatch({ type: 'set-twilio-status', statusObj });
      })

      .catch((error) => {
        dispatch({ type: 'set-twilio-status-error', error });
      });
  }, [dispatch]);

  return { getTwilioStatus } as const;
}
