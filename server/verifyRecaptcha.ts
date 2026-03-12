import { Request, Response, NextFunction } from 'express';
import { verifyRecaptchaToken } from './recaptcha_core';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export function createVerifyRecaptcha(expectedAction?: string | string[]) {
  const allowedActions = expectedAction
    ? Array.isArray(expectedAction) ? expectedAction : [expectedAction]
    : null;

  return function verifyRecaptcha(req: Request, res: Response, next: NextFunction) {
    if (!RECAPTCHA_SECRET_KEY) {
      return next();
    }

    const token = req.get('x-recaptcha-token');

    if (!token) {
      return res.status(403).json({ error: { message: 'reCAPTCHA token is missing' } });
    }

    verifyRecaptchaToken(RECAPTCHA_SECRET_KEY, token)
      .then(({ passed, result }: { passed: boolean; result: { action?: string } }) => {
        if (!passed) {
          console.warn('reCAPTCHA verification failed:', result);
          return res.status(403).json({ error: { message: 'reCAPTCHA verification failed' } });
        }
        if (allowedActions && !allowedActions.includes(result.action ?? '')) {
          console.warn('reCAPTCHA action mismatch: expected', expectedAction, 'got', result.action);
          return res.status(403).json({ error: { message: 'reCAPTCHA action mismatch' } });
        }
        next();
      })
      .catch((error: Error) => {
        console.error('reCAPTCHA verification error:', error);
        return res.status(500).json({ error: { message: 'reCAPTCHA verification error' } });
      });
  };
}
