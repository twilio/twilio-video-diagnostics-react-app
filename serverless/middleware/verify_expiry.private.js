exports.handler = function (context, event, callback) {
    if (Date.now() > context.APP_EXPIRY) {
      const response = new Twilio.Response();
      response.appendHeader('Content-Type', 'application/json');
      response.setStatusCode(401);
      response.setBody({
        error: {
          message: 'token server expired',
          explanation:
            'The token server has expired. Re-deploy the application to refresh the token server.',
        },
      });
      return callback(null, response);
    }
  };
