exports.handler = function (context, event, callback) {
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  verifyExpiry.handler(context, event, callback);

  const { verifyRecaptcha } = require(Runtime.getAssets()['/verify_recaptcha.js'].path);
  verifyRecaptcha(context, event, callback, function () {
    const client = context.getTwilioClient();
    client.tokens.create({ ttl: 30 }).then((token) => callback(null, token));
  });
};
