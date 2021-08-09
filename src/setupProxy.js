const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/token',
    createProxyMiddleware({
      target: process.env.PROXY_URL,
      changeOrigin: true,
    })
  );
};
