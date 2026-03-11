class Response {
    constructor() {
      this.statusCode = null;
      this.body = null;
      this.headers = {};
    }
  
    setStatusCode(code) {
      this.statusCode = code;
    }
  
    setBody(body) {
      this.body = body;
    }
  
    appendHeader(key, value) {
      this.headers[key] = value;
    }
  }
  
  global.Twilio = require('twilio');
  global.Twilio.Response = Response;
  
  const verifyExpiryPath = `${__dirname}/../middleware/verify_expiry.private.js`;
  const verifyRecaptchaPath = `${__dirname}/../middleware/verify_recaptcha.private.js`;

  global.Runtime = {
    getAssets: () => ({
      '/verify_expiry.js': {
        path: verifyExpiryPath,
      },
      '/verify_recaptcha.js': {
        path: verifyRecaptchaPath,
      },
    }),
  };

  // Mocking this as a no-op since this function is tested in '__tests__/middleware/verify_expiry.ts'.
  jest.mock(verifyExpiryPath, () => ({ handler: () => {} }));
  // Mocking reCAPTCHA verification as a pass-through since it's tested separately.
  jest.mock(verifyRecaptchaPath, () => ({ verifyRecaptcha: (_ctx, _event, _cb, next) => next() }));
  
  process.on('unhandledRejection', (err) => {
    console.error(err);
    throw err;
  });
