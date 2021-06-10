const constants = require('../constants');
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

async function findApp() {
  const services = await client.serverless.services.list();
  return services.find((service) => service.friendlyName.includes(constants.SERVICE_NAME));
}

async function getAppInfo() {
  const app = await findApp();
  if (!app) return null;

  const appInstance = client.serverless.services(app.sid);
  const [environment] = await appInstance.environments.list();
  const variables = await appInstance.environments(environment.sid).variables.list();
  const expiryVar = variables.find((v) => v.key === 'APP_EXPIRY');
  const expiryDate = new Date(Number(expiryVar.value)).toString();

  console.log('App deployed to: https://' + environment.domainName);
  console.log(`This URL is for demo purposes only. It will expire on ${expiryDate}`);
}

if (require.main === module) {
  getAppInfo();
} else {
  module.exports = getAppInfo;
}
