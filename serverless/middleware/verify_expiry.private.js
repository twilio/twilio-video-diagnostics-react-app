exports.handler = function (context, event, callback) {
    if (Date.now() > context.APP_EXPIRY) {
      const response = new Twilio.Response();
      response.appendHeader('Content-Type', 'application/json');
      response.setStatusCode(401);
      response.setBody({
        error: {
          message: 'passcode expired',
          explanation:
            'The passcode used to validate application users has expired. Re-deploy the application to refresh the passcode.',
        },
      });
      return callback(null, response);
    }
  };
