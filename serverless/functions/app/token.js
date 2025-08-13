exports.handler = function (context, event, callback) {
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  verifyExpiry.handler(context, event, callback);

  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const videoGrant = new VideoGrant();

  const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET, {
    ttl: 60,
    identity: context.VIDEO_IDENTITY,
  });
  token.addGrant(videoGrant);

  callback(null, { token: token.toJwt() });
};
