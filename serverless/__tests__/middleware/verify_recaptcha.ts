const https = require('https');

jest.mock('https');

const { verifyRecaptcha } = jest.requireActual('../../middleware/verify_recaptcha.private');

function mockRecaptchaApiResponse(responseBody: object) {
  (https.request as jest.Mock).mockImplementation((_options: any, callback: any) => {
    const mockRes = {
      on: jest.fn((event: string, handler: any) => {
        if (event === 'data') handler(JSON.stringify(responseBody));
        if (event === 'end') handler();
      }),
    };
    callback(mockRes);
    return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
  });
}

describe('the verify_recaptcha middleware', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next() when RECAPTCHA_SECRET_KEY is not set', () => {
    const mockCallback = jest.fn();
    const mockNext = jest.fn();
    verifyRecaptcha({}, {}, mockCallback, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should return 403 when recaptchaToken is missing', () => {
    const mockCallback = jest.fn();
    const mockNext = jest.fn();
    verifyRecaptcha({ RECAPTCHA_SECRET_KEY: 'test-secret' }, {}, mockCallback, mockNext);

    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
      statusCode: 403,
      body: { error: { message: 'reCAPTCHA token is missing' } },
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() when verification succeeds with a passing score', async () => {
    mockRecaptchaApiResponse({ success: true, score: 0.9, action: 'test' });
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    await verifyRecaptcha(
      { RECAPTCHA_SECRET_KEY: 'test-secret' },
      { recaptchaToken: 'valid-token' },
      mockCallback,
      mockNext
    );

    // Wait for the promise chain to resolve
    await new Promise((r) => setImmediate(r));

    expect(mockNext).toHaveBeenCalled();
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should return 403 when score is below threshold', async () => {
    mockRecaptchaApiResponse({ success: true, score: 0.2 });
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    await verifyRecaptcha(
      { RECAPTCHA_SECRET_KEY: 'test-secret' },
      { recaptchaToken: 'valid-token' },
      mockCallback,
      mockNext
    );

    await new Promise((r) => setImmediate(r));

    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
      statusCode: 403,
      body: { error: { message: 'reCAPTCHA verification failed' } },
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 when verification fails (success: false)', async () => {
    mockRecaptchaApiResponse({ success: false, 'error-codes': ['invalid-input-response'] });
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    await verifyRecaptcha(
      { RECAPTCHA_SECRET_KEY: 'test-secret' },
      { recaptchaToken: 'invalid-token' },
      mockCallback,
      mockNext
    );

    await new Promise((r) => setImmediate(r));

    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
      statusCode: 403,
      body: { error: { message: 'reCAPTCHA verification failed' } },
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 when the Google API request fails', async () => {
    (https.request as jest.Mock).mockImplementation((_options: any, _callback: any) => {
      return {
        on: jest.fn((event: string, handler: any) => {
          if (event === 'error') handler(new Error('network error'));
        }),
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    await verifyRecaptcha(
      { RECAPTCHA_SECRET_KEY: 'test-secret' },
      { recaptchaToken: 'valid-token' },
      mockCallback,
      mockNext
    );

    await new Promise((r) => setImmediate(r));

    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
      statusCode: 500,
      body: { error: { message: 'reCAPTCHA verification error' } },
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// To avoid the 'All files must be modules when the '--isolatedModules' flag is provided.' error
export default null; // eslint-disable-line
