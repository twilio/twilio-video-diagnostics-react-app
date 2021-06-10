exports.handler = function (context, event, callback) {
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  verifyExpiry.handler(context, event, callback);

  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const videoGrant = new VideoGrant();

  const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET, {
    ttl: 60,
  });
  token.addGrant(videoGrant);
  token.identity = context.VIDEO_IDENTITY;

  callback(null, { token: token.toJwt() });
};
