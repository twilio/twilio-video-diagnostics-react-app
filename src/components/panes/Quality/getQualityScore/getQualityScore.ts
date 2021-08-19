import { QualityScore } from '../Quality';
import { PreflightTestReport } from 'twilio-video';
import { MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';
import { round } from '../../../../utils';

export function getSingleQualityScore(
  kind: string,
  stat: number | undefined,
  goodThreshold: number,
  averageThreshold: number,
  badThreshold: number
) {
  if (typeof stat === 'undefined') {
    // We ignore values that are missing
    return QualityScore.Excellent;
  }

  if (kind === 'bitrate') {
    if (stat > goodThreshold) return QualityScore.Excellent;
    if (stat > averageThreshold) return QualityScore.Good;
    if (stat > badThreshold) return QualityScore.Average;
    return QualityScore.Bad;
  }

  if (stat >= badThreshold) return QualityScore.Bad;
  if (stat >= averageThreshold) return QualityScore.Average;
  if (stat >= goodThreshold) return QualityScore.Good;
  return QualityScore.Excellent;
}

export function getQualityScore(
  preflightTestReport: PreflightTestReport,
  bitrateTestReport: MediaConnectionBitrateTest.Report
) {
  const maxBitrate = bitrateTestReport?.values ? Math.max(...bitrateTestReport?.values) : 0;
  const minBitrate = bitrateTestReport?.values ? Math.min(...bitrateTestReport?.values) : 0;

  const latency = {
    average: preflightTestReport?.stats!.rtt!.average,
    max: preflightTestReport?.stats!.rtt!.max,
    qualityScore: getSingleQualityScore('latency', preflightTestReport?.stats!.rtt!.average, 100, 250, 400),
  };

  const jitter = {
    average: round(preflightTestReport?.stats!.jitter!.average, 2),
    max: round(preflightTestReport?.stats!.jitter!.max, 2),
    qualityScore: getSingleQualityScore('jitter', preflightTestReport?.stats!.jitter!.average, 5, 10, 30),
  };

  const packetLoss = {
    average: round(preflightTestReport?.stats!.packetLoss!.average, 2),
    max: round(preflightTestReport?.stats!.packetLoss!.max, 2),
    qualityScore: getSingleQualityScore('packetLoss', preflightTestReport?.stats!.packetLoss!.average, 1, 3, 8),
  };

  const bitrate = {
    average: round(bitrateTestReport?.averageBitrate, 2),
    max: round(maxBitrate, 2),
    min: round(minBitrate, 2),
    qualityScore: getSingleQualityScore('bitrate', bitrateTestReport?.averageBitrate, 1000, 500, 150),
  };

  const totalQualityScore = Math.min(
    latency.qualityScore,
    jitter.qualityScore,
    packetLoss.qualityScore,
    bitrate.qualityScore
  ) as QualityScore;

  return {
    latency,
    jitter,
    packetLoss,
    bitrate,
    totalQualityScore,
  };
}
