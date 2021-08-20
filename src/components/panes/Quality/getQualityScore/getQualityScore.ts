import { QualityScore } from '../Quality';
import { PreflightTestReport } from 'twilio-video';
import { MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';

export function getSingleQualityScore(
  stat: number | undefined,
  goodThreshold: number,
  averageThreshold: number,
  badThreshold: number,
  descending: boolean = false
) {
  if (typeof stat === 'undefined') {
    // We ignore values that are missing
    return QualityScore.Excellent;
  }

  if (descending) {
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
  preflightTestReport: PreflightTestReport | null,
  bitrateTestReport: MediaConnectionBitrateTest.Report | null
) {
  const maxBitrate = bitrateTestReport?.values ? Math.max(...bitrateTestReport.values) : 0;
  const minBitrate = bitrateTestReport?.values ? Math.min(...bitrateTestReport.values) : 0;

  const latency = {
    average: preflightTestReport?.stats!.rtt!.average.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    max: preflightTestReport?.stats!.rtt!.max.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.rtt!.average, 100, 250, 400),
  };

  const jitter = {
    average: preflightTestReport?.stats!.jitter!.average.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    max: preflightTestReport?.stats!.jitter!.max.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.jitter!.average, 5, 10, 30),
  };

  const packetLoss = {
    average: preflightTestReport?.stats!.packetLoss!.average.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    max: preflightTestReport?.stats!.packetLoss!.max.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.packetLoss!.average, 1, 3, 8),
  };

  const bitrate = {
    average: bitrateTestReport?.averageBitrate!.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    max: maxBitrate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
    min: minBitrate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
    qualityScore: getSingleQualityScore(bitrateTestReport?.averageBitrate!, 1000, 500, 150, true),
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
