import { handler } from '../../functions/token';
import jwt, { VerifyCallback } from 'jsonwebtoken';

const mockContext = {
  API_KEY: 'mockkey',
  API_SECRET: 'mocksecret',
  ACCOUNT_SID: 'mocksid',
  VIDEO_IDENTITY: 'test-identity',
};

Date.now = () => 1589568597000;

describe('the token function', () => {
  it('should return a valid json web token', () => {
    const mockCallback = jest.fn();
    handler(mockContext, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({ token: expect.any(String) }));

    const token = mockCallback.mock.calls[0][1].token;
    jwt.verify(token, mockContext.API_SECRET, ((err, decoded) => {
      expect(err).toBeNull();
      expect(decoded).toMatchInlineSnapshot(`
        Object {
          "exp": 1589568657,
          "grants": Object {
            "identity": "test-identity",
            "video": Object {},
          },
          "iat": 1589568597,
          "iss": "mockkey",
          "jti": "mockkey-1589568597",
          "sub": "mocksid",
        }
      `);
    }) as VerifyCallback);
  });
});
