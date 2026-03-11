import './bootstrap-globals';
import { createExpressHandler, isServiceUnavailable } from './createExpressHandler';
import express from 'express';
import path from 'path';
import { ServerlessFunction } from './types';
import { verifyRecaptcha } from './verifyRecaptcha';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

if (isServiceUnavailable) {
  app.use((_, res) => {
    res.status(503).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Unavailable</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { font-size: 1.125rem; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Service Unavailable</h1>
    <p>This hosted version of the tool is currently unavailable. You can clone the <a href="https://github.com/twilio/twilio-video-diagnostics-react-app">official repository</a> and deploy your own instance if you need immediate access.</p>
  </div>
</body>
</html>`);
  });
} else {
  // This server reuses the serverless endpoints from /serverless/functions/app, which is used when the "npm run serverless:deploy" command is run.
  const tokenFunction: ServerlessFunction = require('../serverless/functions/app/token').handler;
  const tokenEndpoint = createExpressHandler(tokenFunction);

  const turnCredentialsFunction: ServerlessFunction = require('../serverless/functions/app/turn-credentials').handler;
  const turnCredentialsEndpoint = createExpressHandler(turnCredentialsFunction);

  app.all('/app/token', verifyRecaptcha, tokenEndpoint);
  app.all('/app/turn-credentials', verifyRecaptcha, turnCredentialsEndpoint);

  app.use((req, res, next) => {
    // Here we add Cache-Control headers in accordance with the create-react-app best practices.
    // See: https://create-react-app.dev/docs/production-build/#static-file-caching
    if (req.path === '/' || req.path === 'index.html') {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
    } else {
      res.set('Cache-Control', 'max-age=31536000');
      next();
    }
  });

  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (_, res) => {
    // Don't cache index.html
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  });
}

app.listen(PORT, () => console.log(`twilio-video-diagnostics-react-app server running on ${PORT}`));
