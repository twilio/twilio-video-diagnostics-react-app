import { QualityScore } from '../Quality';
import { PreflightTestReport } from 'twilio-video';
import { MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';

export function getSingleQualityScore(
  stat: number | undefined,
  goodThreshold: number,
  suboptimalThreshold: number,
  poorThreshold: number,
  descending: boolean = false
) {
  if (typeof stat === 'undefined') {
    // We ignore values that are missing
    return QualityScore.Excellent;
  }

  if (descending) {
    if (stat > goodThreshold) return QualityScore.Excellent;
    if (stat > suboptimalThreshold) return QualityScore.Good;
    if (stat > poorThreshold) return QualityScore.Suboptimal;
    return QualityScore.Poor;
  }

  if (stat >= poorThreshold) return QualityScore.Poor;
  if (stat >= suboptimalThreshold) return QualityScore.Suboptimal;
  if (stat >= goodThreshold) return QualityScore.Good;
  return QualityScore.Excellent;
}

export const formatNumber = (val: number | undefined) => {
  return val?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export function getQualityScore(
  preflightTestReport: PreflightTestReport | null,
  bitrateTestReport: MediaConnectionBitrateTest.Report | null
) {
  const maxBitrate = bitrateTestReport?.values ? Math.max(...bitrateTestReport.values) : 0;

  const latency = {
    average: formatNumber(preflightTestReport?.stats!.rtt!.average),
    max: formatNumber(preflightTestReport?.stats!.rtt!.max),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.rtt!.average, 100, 250, 400),
  };

  const jitter = {
    average: formatNumber(preflightTestReport?.stats!.jitter!.average),
    max: formatNumber(preflightTestReport?.stats!.jitter!.max),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.jitter!.average, 5, 10, 30),
  };

  const packetLoss = {
    average: formatNumber(preflightTestReport?.stats!.packetLoss!.average),
    max: formatNumber(preflightTestReport?.stats!.packetLoss!.max),
    qualityScore: getSingleQualityScore(preflightTestReport?.stats!.packetLoss!.average, 1, 3, 8),
  };

  const bitrate = {
    average: formatNumber(bitrateTestReport?.averageBitrate!),
    max: formatNumber(maxBitrate),
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
