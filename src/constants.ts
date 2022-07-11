import { default as appInfo } from '../package.json';

export const APP_NAME = appInfo.name;

export const AUDIO_LEVEL_THRESHOLD = 200;

export const AUDIO_LEVEL_STANDARD_DEVIATION_THRESHOLD = AUDIO_LEVEL_THRESHOLD * 0.05; // 5% threshold

export const INPUT_TEST_DURATION = 20000;

export const RECORD_DURATION = 4000;
