exports.handler = function (context, event, callback) {
  // verifyExpiry.handler calls callback synchronously when the app is expired.
  // We intercept the callback to detect this and short-circuit before proceeding.
  // NOTE: This pattern breaks if verifyExpiry.handler ever becomes asynchronous.
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  let expiryHandled = false;
  verifyExpiry.handler(context, event, function (err, result) {
    expiryHandled = true;
    return callback(err, result);
  });
  if (expiryHandled) {
    return;
  }

  const { verifyRecaptcha } = require(Runtime.getAssets()['/verify_recaptcha.js'].path);
  verifyRecaptcha(context, event, callback, function () {
    const client = context.getTwilioClient();
    client.tokens.create({ ttl: 30 }).then((token) => callback(null, token));
  }, 'bitrate_test');
};
