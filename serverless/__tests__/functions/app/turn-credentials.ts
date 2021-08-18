import { handler } from '../../../functions/app/turn-credentials';

const mockClient = {
  tokens: {
    create: jest.fn(() => Promise.resolve('mock token')),
  },
};

describe('the turn-credentials function', () => {
  it('should return turn credentials', (done) => {
    const mockCallback = jest.fn();
    handler({ getTwilioClient: () => mockClient }, {}, mockCallback);
    expect(mockClient.tokens.create).toHaveBeenCalledWith({ ttl: 30 });
    setImmediate(() => {
      expect(mockCallback).toHaveBeenCalledWith(null, 'mock token');
      done();
    });
  });
});
