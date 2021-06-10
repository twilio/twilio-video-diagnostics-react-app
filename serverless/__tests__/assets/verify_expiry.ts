const { handler } = jest.requireActual('../../../serverless/middleware/verify_expiry.private');

Date.now = () => 2;

describe('the verify_expiry asset', () => {
  it('should not call the callback function when the current date is less than APP_EXPIRY', () => {
    const mockCallback = jest.fn();
    handler(
      {
        APP_EXPIRY: 3,
      },
      {},
      mockCallback
    );
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the callback function when the current date is greater than APP_EXPIRY', () => {
    const mockCallback = jest.fn();
    handler(
      {
        APP_EXPIRY: 1,
      },
      {},
      mockCallback
    );
    expect(mockCallback).toHaveBeenCalledWith(null, {
      body: {
        error: {
          explanation:
            'The token server has expired. Re-deploy the application to refresh the token server.',
          message: 'token server expired',
        },
      },
      headers: { 'Content-Type': 'application/json' },
      statusCode: 401,
    });
  });
});

// To avoid the 'All files must be modules when the '--isolatedModules' flag is provided.' error
export default null; // eslint-disable-line
