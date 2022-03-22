import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

// This server reuses the serverless endpoints from /serverless/functions/app, which is used when the "npm run serverless:deploy" command is run.
const tokenFunction: ServerlessFunction = require('../serverless/functions/app/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const turnCredentialsFunction: ServerlessFunction = require('../serverless/functions/app/turn-credentials').handler;
const turnCredentialsEndpoint = createExpressHandler(turnCredentialsFunction);

app.all('/app/token', tokenEndpoint);
app.all('/app/turn-credentials', turnCredentialsEndpoint);

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

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
