/* eslint-disable import/first */
process.env.ACCOUNT_SID = 'mockAccountSid';
process.env.TWILIO_API_KEY_SID = 'mockApiKeySid';
process.env.TWILIO_API_KEY_SECRET = 'mockApiKeySecret';
process.env.VIDEO_IDENTITY = 'mockVideoIdentity';

import { createExpressHandler } from '../createExpressHandler';
import { ServerlessFunction } from '../types';
import Twilio from 'twilio';

jest.mock('twilio', () => jest.fn(() => 'mockTwilioClient'));

const mockRequest: any = {
  body: {
    foo: 'bar',
  },
};

const mockResponse: any = {
  json: jest.fn(),
};

describe('the createExpressHandler function', () => {
  afterEach(jest.clearAllMocks);

  it('should correctly initialize a Twilio client', () => {
    expect(Twilio).toHaveBeenCalledWith('mockApiKeySid', 'mockApiKeySecret', { accountSid: 'mockAccountSid' });
  });

  it('should pass the correct context object, event object, and callback function to the serverless funtion', () => {
    const mockServerlessFunction: ServerlessFunction = (context, event, callback) => {
      expect(context).toEqual({
        ACCOUNT_SID: 'mockAccountSid',
        API_KEY: 'mockApiKeySid',
        API_SECRET: 'mockApiKeySecret',
        VIDEO_IDENTITY: 'mockVideoIdentity',
        getTwilioClient: expect.any(Function),
      });

      expect(context.getTwilioClient()).toEqual('mockTwilioClient');
      expect(event).toEqual({ foo: 'bar' });
      expect(callback).toEqual(expect.any(Function));
    };

    const expressHandler = createExpressHandler(mockServerlessFunction);
    expressHandler(mockRequest, mockResponse);
  });

  it('should call the correct express methods when the callback is called with a TwilioResponse object', () => {
    const mockServerlessFunction: ServerlessFunction = (_, __, callback) => {
      const mockTwilioResponse: any = {
        body: { foo: 'bar' },
        statusCode: 401,
        headers: { mockHeader: '123' },
      };

      callback(null, mockTwilioResponse);
    };

    const expressHandler = createExpressHandler(mockServerlessFunction);
    expressHandler(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      body: { foo: 'bar' },
      statusCode: 401,
      headers: { mockHeader: '123' },
    });
  });
});
