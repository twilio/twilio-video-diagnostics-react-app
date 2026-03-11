import { Request, Response, NextFunction } from 'express';
import https from 'https';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const SCORE_THRESHOLD = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

function verifyToken(token: string): Promise<RecaptchaResponse> {
  return new Promise((resolve, reject) => {
    const postData = `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY!)}&response=${encodeURIComponent(token)}`;

    const req = https.request(
      {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Failed to parse reCAPTCHA response'));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

export function verifyRecaptcha(req: Request, res: Response, next: NextFunction) {
  if (!RECAPTCHA_SECRET_KEY) {
    return next();
  }

  const token = req.headers['x-recaptcha-token'] as string | undefined;

  if (!token) {
    return res.status(403).json({ error: { message: 'reCAPTCHA token is missing' } });
  }

  verifyToken(token)
    .then((result) => {
      if (!result.success || (result.score !== undefined && result.score < SCORE_THRESHOLD)) {
        console.warn('reCAPTCHA verification failed:', result);
        return res.status(403).json({ error: { message: 'reCAPTCHA verification failed' } });
      }
      next();
    })
    .catch((error) => {
      console.error('reCAPTCHA verification error:', error);
      return res.status(500).json({ error: { message: 'reCAPTCHA verification error' } });
    });
}
