exports.handler = function (context, event, callback) {
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
    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const videoGrant = new VideoGrant();

    const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET, {
      ttl: 60,
      identity: context.VIDEO_IDENTITY,
    });
    token.addGrant(videoGrant);

    callback(null, { token: token.toJwt() });
  }, ['token_check', 'preflight']);
};
