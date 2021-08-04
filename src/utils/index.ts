import { AUDIO_LEVEL_THRESHOLD } from '../constants';

export function getAudioLevelPercentage(level: number) {
  return (level * 100) / AUDIO_LEVEL_THRESHOLD; // 0 to 100
}

export function getStandardDeviation(values: number[]): number {
  // Same method used in client sdks
  // https://github.com/twilio/twilio-client.js/blob/master/lib/twilio/statsMonitor.ts#L88

  if (values.length <= 0) {
    return 0;
  }

  const valueAverage: number =
    values.reduce((partialSum: number, value: number) => partialSum + value, 0) / values.length;

  const diffSquared: number[] = values.map((value: number) => Math.pow(value - valueAverage, 2));

  const stdDev: number = Math.sqrt(
    diffSquared.reduce((partialSum: number, value: number) => partialSum + value, 0) / diffSquared.length
  );

  return round(stdDev);
}

export const round = (num: number, decimals = 2) =>
  Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
