import { DiagnosticError, testVideoInputDevice, VideoInputTest } from '@twilio/rtc-diagnostics';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { useState, useRef, useCallback } from 'react';

export function useCameraTest() {
  const { dispatch } = useAppStateContext();
  const [videoTest, setVideoTest] = useState<VideoInputTest>();
  const videoElementRef = useRef<HTMLVideoElement>(null!);
  const [videoTestError, setVideoTestError] = useState<DiagnosticError>();

  const stopVideoTest = useCallback(() => {
    setVideoTest(undefined);
    videoTest?.stop();
  }, [videoTest]);

  const startVideoTest = useCallback(
    (deviceId: string) => {
      stopVideoTest();
      const test = testVideoInputDevice({ element: videoElementRef.current, deviceId });
      setVideoTest(test);
      test.on(VideoInputTest.Events.Error, (err) => setVideoTestError(err));
      test.on(VideoInputTest.Events.End, (report) => dispatch({ type: 'set-video-test-report', report }));
    },
    [stopVideoTest]
  );

  return { startVideoTest, stopVideoTest, videoElementRef, videoTest, videoTestError } as const;
}
