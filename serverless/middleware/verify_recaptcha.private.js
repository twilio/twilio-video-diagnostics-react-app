const https = require('https');

const SCORE_THRESHOLD = 0.5;

function verifyToken(secretKey, token) {
  return new Promise((resolve, reject) => {
    const postData = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`;

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
          } catch (e) {
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

/**
 * Verifies the reCAPTCHA token from the event and calls `next` on success.
 * If RECAPTCHA_SECRET_KEY is not configured, skips verification and calls `next` immediately.
 */
exports.verifyRecaptcha = function (context, event, callback, next) {
  const secretKey = context.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return next();
  }

  const token = event.recaptchaToken;

  if (!token) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(403);
    response.setBody({ error: { message: 'reCAPTCHA token is missing' } });
    return callback(null, response);
  }

  verifyToken(secretKey, token)
    .then((result) => {
      if (!result.success || (result.score !== undefined && result.score < SCORE_THRESHOLD)) {
        console.warn('reCAPTCHA verification failed:', result);
        const response = new Twilio.Response();
        response.appendHeader('Content-Type', 'application/json');
        response.setStatusCode(403);
        response.setBody({ error: { message: 'reCAPTCHA verification failed' } });
        return callback(null, response);
      }
      next();
    })
    .catch((error) => {
      console.error('reCAPTCHA verification error:', error);
      const response = new Twilio.Response();
      response.appendHeader('Content-Type', 'application/json');
      response.setStatusCode(500);
      response.setBody({ error: { message: 'reCAPTCHA verification error' } });
      return callback(null, response);
    });
};
