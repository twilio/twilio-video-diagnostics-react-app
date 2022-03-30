import 'dotenv/config';
import { Request, Response } from 'express';
import { ServerlessContext, ServerlessFunction } from './types';
import Twilio from 'twilio';

const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, VIDEO_IDENTITY } = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: ACCOUNT_SID,
});

twilioClient.tokens.create().catch((error) => {
  if (error.status === 401) {
    console.error(
      'ERROR: Unable to authenticate user. Please verify that your environment variables contain the correct Twilio account credentials.'
    );
  } else {
    console.error('ERROR:', error.message);
  }
  process.exit(1);
});

const context: ServerlessContext = {
  ACCOUNT_SID: ACCOUNT_SID,
  API_KEY: TWILIO_API_KEY_SID,
  API_SECRET: TWILIO_API_KEY_SECRET,
  getTwilioClient: () => twilioClient,
  VIDEO_IDENTITY,
};

export function createExpressHandler(serverlessFunction: ServerlessFunction) {
  return (req: Request, res: Response) => {
    serverlessFunction(context, req.body, (_, serverlessResponse) => {
      res.json(serverlessResponse);
    });
  };
}
