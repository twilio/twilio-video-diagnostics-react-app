/**
 * Verifies the reCAPTCHA token from the event and calls `next` on success.
 * If RECAPTCHA_SECRET_KEY is not configured, skips verification and calls `next` immediately.
 */
exports.verifyRecaptcha = function (context, event, callback, next, expectedAction) {
  const secretKey = context.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY is not configured, skipping verification');
    return next();
  }

  let token = event.recaptchaToken;
  if (!token && event && event.request && event.request.headers) {
    const headers = event.request.headers;
    token = headers['x-recaptcha-token'] || headers['X-Recaptcha-Token'];
  }

  if (!token) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(403);
    response.setBody({ error: { message: 'reCAPTCHA token is missing' } });
    return callback(null, response);
  }

  const { verifyRecaptchaToken } = require(Runtime.getAssets()['/recaptcha_core.js'].path);

  verifyRecaptchaToken(secretKey, token)
    .then(({ passed, result }) => {
      if (!passed) {
        console.warn('reCAPTCHA verification failed:', result);
        const response = new Twilio.Response();
        response.appendHeader('Content-Type', 'application/json');
        response.setStatusCode(403);
        response.setBody({ error: { message: 'reCAPTCHA verification failed' } });
        return callback(null, response);
      }
      const allowedActions = expectedAction
        ? Array.isArray(expectedAction) ? expectedAction : [expectedAction]
        : null;
      if (allowedActions && !allowedActions.includes(result.action)) {
        console.warn('reCAPTCHA action mismatch: expected', expectedAction, 'got', result.action);
        const response = new Twilio.Response();
        response.appendHeader('Content-Type', 'application/json');
        response.setStatusCode(403);
        response.setBody({ error: { message: 'reCAPTCHA action mismatch' } });
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
