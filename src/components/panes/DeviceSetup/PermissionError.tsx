import React from 'react';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';

export function getSnackbarContent(error: Error) {
  let headline = '';
  let message = '';

  switch (true) {
    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === 'NotAllowedError':
      headline = 'Unable to Access Media:';

      if (error!.message === 'Permission denied by system') {
        // Chrome only
        message =
          'The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.';
      } else {
        message =
          'The user has denied permission to use audio and video. Please grant permission to the browser to access the microphone and camera.';
      }

      break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === 'NotFoundError':
      headline = 'Cannot Find Microphone or Camera:';
      message =
        'The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.';
      break;

    // Other getUserMedia errors are less likely to happen in this app. Here we will display
    // the system's error message directly to the user.
    case Boolean(error):
      headline = 'Error Acquiring Media:';
      message = `${error!.name} ${error!.message}`;
      break;
  }
  return {
    headline,
    message,
  };
}

export function PermissionError() {
  const { deviceError } = useAppStateContext();
  const { headline, message } = getSnackbarContent(deviceError);
  return (
    <>
      <div>{headline}</div>
      <div>{message}</div>)
    </>
  );
}
