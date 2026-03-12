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
 * Verifies a reCAPTCHA token against the Google API and checks the result score.
 * Resolves with { passed, result } where `passed` is true if verification succeeded
 * and the score meets the threshold.
 */
async function verifyRecaptchaToken(secretKey, token) {
  const result = await verifyToken(secretKey, token);
  if (!result.success || result.score === undefined || result.score < SCORE_THRESHOLD) {
    return { passed: false, result };
  }
  return { passed: true, result };
}

exports.verifyRecaptchaToken = verifyRecaptchaToken;
exports.SCORE_THRESHOLD = SCORE_THRESHOLD;
