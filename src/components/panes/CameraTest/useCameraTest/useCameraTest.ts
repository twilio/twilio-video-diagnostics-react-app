import { testVideoInputDevice, VideoInputTest } from '@twilio/rtc-diagnostics';
import { useState, useRef, useCallback } from 'react';

export function useCameraTest() {
  const [videoTest, setVideoTest] = useState<VideoInputTest>();
  const videoElementRef = useRef<HTMLVideoElement>(null!);

  const stopVideoTest = useCallback(() => {
    setVideoTest(undefined);
    videoTest?.stop();
  }, [videoTest]);

  const startVideoTest = useCallback((deviceId: string) => {
    const test = testVideoInputDevice({ element: videoElementRef.current, deviceId });
    setVideoTest(test);
  }, []);

  return { startVideoTest, stopVideoTest, videoElementRef, videoTest } as const;
}
