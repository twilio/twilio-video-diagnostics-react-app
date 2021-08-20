import { getDeviceErrorPaneContent } from './PermissionError';

describe('the getDeviceErrorPaneContent function', () => {
  it('should return empty strings by default', () => {
    const results = getDeviceErrorPaneContent();
    expect(results).toMatchInlineSnapshot(`
          Object {
            "headline": "",
            "message": "",
          }
        `);
  });

  it('should return the correct content when there is a NotAllowedError', () => {
    const error = new Error();
    error.name = 'NotAllowedError';
    const results = getDeviceErrorPaneContent(error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Permissions needed",
        "message": "We can't access your microphone/camera which means we don't have permissions for audio, video, and screen-sharing. Depending on your browser or operating system, these might live in \\"Settings\\".",
      }
    `);
  });

  it('should return the correct content when there is a NotAllowedError with "Permission denied by system" message', () => {
    const error = new Error('Permission denied by system');
    error.name = 'NotAllowedError';
    const results = getDeviceErrorPaneContent(error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Permissions needed",
        "message": "The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.",
      }
    `);
  });

  it('should return the correct content when there is a NotFoundError', () => {
    const error = new Error();
    error.name = 'NotFoundError';
    const results = getDeviceErrorPaneContent(error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Cannot find microphone or camera",
        "message": "The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.",
      }
    `);
  });

  it('should return the correct content when there is any other kind of error', () => {
    const error = new Error('Any other device errors');
    error.name = 'OtherDeviceError';
    const results = getDeviceErrorPaneContent(error);
    expect(results).toMatchInlineSnapshot(`
      Object {
        "headline": "Error acquiring media",
        "message": "OtherDeviceError Any other device errors",
      }
    `);
  });
});
