import React, { createContext, useCallback, useContext } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  '@global': {
    '.grecaptcha-badge': {
      left: '4px !important',
      right: 'auto !important',
    },
  },
});

export type GetRecaptchaToken = (action: string) => Promise<string | undefined>;

const RecaptchaTokenContext = createContext<GetRecaptchaToken | undefined>(undefined);

export function useRecaptchaToken(): GetRecaptchaToken | undefined {
  return useContext(RecaptchaTokenContext);
}

function RecaptchaTokenProvider({ children }: { children: React.ReactNode }) {
  useStyles();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = useCallback(
    async (action: string) => {
      if (!executeRecaptcha) return undefined;
      return executeRecaptcha(action);
    },
    [executeRecaptcha]
  );

  return <RecaptchaTokenContext.Provider value={getRecaptchaToken}>{children}</RecaptchaTokenContext.Provider>;
}

export function RecaptchaProvider({ siteKey, children }: { siteKey?: string; children: React.ReactNode }) {
  if (siteKey) {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
        <RecaptchaTokenProvider>{children}</RecaptchaTokenProvider>
      </GoogleReCaptchaProvider>
    );
  }
  return <>{children}</>;
}
