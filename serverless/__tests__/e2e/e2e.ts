import runDeploy from '../../scripts/deploy';
import runRemove from '../../scripts/remove';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import Twilio from 'twilio';

const client = Twilio(process.env.API_KEY, process.env.API_SECRET, {
  accountSid: process.env.ACCOUNT_SID,
});

constants.SERVICE_NAME = 'rtc-diagnostics-e2e-test';

const { stdout } = require('stdout-stderr');
const superagent = require('superagent');

describe('the serverless endpoints', () => {
  let appURL: string;

  beforeAll(async () => {
    stdout.start();
    await runDeploy();
    stdout.stop();
    expect(stdout.output).toContain('App deployed to: ');
    appURL = stdout.output.match(/App deployed to: (.+)\n/)[1];
  });

  afterAll(async () => {
    stdout.start();
    await runRemove();
    stdout.stop();

    const services = await client.serverless.services.list();
    const app = services.find((service) => service.friendlyName.includes(constants.SERVICE_NAME));
    expect(app).toBe(undefined);
  });

  describe('the app URL', () => {
    it('should contain random alphanumeric characters', () => {
      const regex = new RegExp(`https://${constants.SERVICE_NAME}-[\\w\\d]{8}-[\\w\\d]+-dev.twil.io`);
      expect(appURL).toMatch(regex);
    });
  });

  describe('the token function', () => {
    it('should return a valid access token', async () => {
      const { body } = await superagent.get(`${appURL}/app/token`);
      const token = jwt.decode(body.token) as { [key: string]: any };
      expect(token.grants.identity).toEqual(constants.VIDEO_IDENTITY);
    });
  });

  describe('the turn-credentials function', () => {
    it('should return turn credentials', async () => {
      const { body } = await superagent.get(`${appURL}/app/turn-credentials`);
      expect(body).toEqual(
        expect.objectContaining({
          password: '[Redacted]',
          ttl: '30',
          username: expect.any(String),
          accountSid: expect.any(String),
          iceServers: expect.arrayContaining([
            {
              url: expect.any(String),
              urls: expect.any(String),
            },
          ]),
        })
      );
    });
  });
});
