/* eslint-disable import/first */
export {}; // ensure this file is treated as a module
const mockHttpsRequest = jest.fn();

jest.mock('https', () => ({
  request: mockHttpsRequest,
}));

function createMockReqResNext(token?: string) {
  const headers: Record<string, string> = token !== undefined ? { 'x-recaptcha-token': token } : {};
  const req: any = {
    headers,
    get: (name: string) => headers[name.toLowerCase()],
  };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

function mockRecaptchaApiResponse(responseBody: object) {
  mockHttpsRequest.mockImplementation((_options: any, callback: any) => {
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

function loadModule() {
  let mod: any;
  jest.isolateModules(() => {
    mod = require('../verifyRecaptcha');
  });
  return mod.verifyRecaptcha;
}

describe('the verifyRecaptcha middleware', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    mockHttpsRequest.mockReset();
    jest.restoreAllMocks();
  });

  it('should call next() when RECAPTCHA_SECRET_KEY is not set', () => {
    const originalKey = process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.RECAPTCHA_SECRET_KEY;

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext();
    verifyRecaptcha(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();

    process.env.RECAPTCHA_SECRET_KEY = originalKey;
  });

  it('should return 403 when the recaptcha token is missing', () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext();
    verifyRecaptcha(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'reCAPTCHA token is missing' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() when verification succeeds with a passing score', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
    mockRecaptchaApiResponse({ success: true, score: 0.9, action: 'test' });

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext('valid-token');
    verifyRecaptcha(req, res, next);

    await new Promise((r) => setTimeout(r, 0));

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 when score is below threshold', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
    mockRecaptchaApiResponse({ success: true, score: 0.2 });

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext('valid-token');
    verifyRecaptcha(req, res, next);

    await new Promise((r) => setTimeout(r, 0));

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'reCAPTCHA verification failed' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when verification fails (success: false)', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
    mockRecaptchaApiResponse({ success: false, 'error-codes': ['invalid-input-response'] });

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext('invalid-token');
    verifyRecaptcha(req, res, next);

    await new Promise((r) => setTimeout(r, 0));

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'reCAPTCHA verification failed' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 when the Google API request fails', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
    mockHttpsRequest.mockImplementation((_options: any, _callback: any) => {
      return {
        on: jest.fn((event: string, handler: any) => {
          if (event === 'error') handler(new Error('network error'));
        }),
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    const verifyRecaptcha = loadModule();
    const { req, res, next } = createMockReqResNext('valid-token');
    verifyRecaptcha(req, res, next);

    await new Promise((r) => setTimeout(r, 0));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'reCAPTCHA verification error' } });
    expect(next).not.toHaveBeenCalled();
  });
});
