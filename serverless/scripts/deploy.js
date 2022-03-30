const { TwilioServerlessApiClient } = require('@twilio-labs/serverless-api');
const { getListOfFunctionsAndAssets } = require('@twilio-labs/serverless-api/dist/utils/fs');
const cli = require('cli-ux').default;
const constants = require('../constants');
const { customAlphabet } = require('nanoid');
const viewApp = require(`${__dirname}/list.js`);

const getRandomString = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 8);

require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const serverlessClient = new TwilioServerlessApiClient({
  accountSid: process.env.ACCOUNT_SID,
  authToken: process.env.AUTH_TOKEN,
});

async function deployFunctions() {
  cli.action.start('Creating Api Key');
  const api_key = await client.newKeys.create({ friendlyName: constants.API_KEY_NAME });
  cli.action.start('Deploying assets and functions');

  const { assets, functions } = await getListOfFunctionsAndAssets(__dirname, {
    functionsFolderNames: ['../functions'],
    assetsFolderNames: ['../../build'],
  });

  // Calling 'getListOfFunctionsAndAssets' twice is necessary because it only gets the assets from
  // the first matching folder in the array
  const { assets: fnAssets } = await getListOfFunctionsAndAssets(__dirname, {
    assetsFolderNames: ['../middleware'],
  });

  assets.push(...fnAssets);

  const indexHTML = assets.find((asset) => asset.name.includes('index.html'));

  if (indexHTML) {
    assets.push({
      ...indexHTML,
      path: '/',
      name: '/',
    });
  }

  const { serviceSid } = await serverlessClient.deployProject({
    env: {
      API_KEY: api_key.sid,
      API_SECRET: api_key.secret,
      VIDEO_IDENTITY: constants.VIDEO_IDENTITY,
      APP_EXPIRY: Date.now() + 1000 * 60 * 60 * 24 * 7, // One week
    },
    pkgJson: {},
    functionsEnv: 'dev',
    assets,
    functions,
    serviceName: `${constants.SERVICE_NAME}-${getRandomString()}`,
  });

  // Make functions editable in console
  await client.serverless.services(serviceSid).update({ uiEditable: true });
}

async function deploy() {
  await deployFunctions();

  cli.action.stop();
  await viewApp();
}

if (require.main === module) {
  deploy();
} else {
  module.exports = deploy;
}
