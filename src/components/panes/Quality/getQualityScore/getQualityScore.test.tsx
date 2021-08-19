import { getSingleQualityScore, getQualityScore } from './getQualityScore';
import { QualityScore } from '../Quality';

describe('the getSingleQualityScore function', () => {
  it('should return QualityScore.Excellent when the provided stat is undefined', () => {
    expect(getSingleQualityScore('latency', undefined, 100, 250, 400)).toBe(QualityScore.Excellent);
  });

  it('should return QualityScore.Bad when the provided stat is equal to or over the Bad threshold', () => {
    expect(getSingleQualityScore('latency', 500, 100, 250, 400)).toBe(QualityScore.Bad);
  });

  it('should return QualityScore.Average when the provided stat is below the Bad threshold and above the Average threshold', () => {
    expect(getSingleQualityScore('latency', 300, 100, 250, 400)).toBe(QualityScore.Average);
  });

  it('should return QualityScore.Good when the provided stat is below the Average threshold and above the Good threshold', () => {
    expect(getSingleQualityScore('latency', 120, 100, 250, 400)).toBe(QualityScore.Good);
  });

  it('should return QualityScore.Excellent when the provided stat is below the Good threshold', () => {
    expect(getSingleQualityScore('latency', 80, 100, 250, 400)).toBe(QualityScore.Excellent);
  });

  describe('when kind is "bitrate"', () => {
    it('should return QualityScore.Excellent when the provided stat is over the Good threshold', () => {
      expect(getSingleQualityScore('bitrate', 1300, 1000, 500, 150)).toBe(QualityScore.Excellent);
    });

    it('should return QualityScore.Good when the provided stat is below the Good threshold and above the Average threshold', () => {
      expect(getSingleQualityScore('bitrate', 800, 1000, 500, 150)).toBe(QualityScore.Good);
    });

    it('should return QualityScore.Average when the provided stat is below the Average threshold and above the Bad threshold', () => {
      expect(getSingleQualityScore('bitrate', 300, 1000, 500, 150)).toBe(QualityScore.Average);
    });

    it('should return QualityScore.Bad when the provided stat is below the Bad threshold', () => {
      expect(getSingleQualityScore('bitrate', 80, 1000, 500, 150)).toBe(QualityScore.Bad);
    });
  });
});

describe('the getQualityScore function', () => {
  it('should return an object containing quality stats and the total quality score', () => {
    const mockPreflightTestReport = {
      stats: { jitter: { average: 0 }, rtt: { average: 80 }, packetLoss: { average: 5 } },
    };
    const mockBitrateTest = { averageBitrate: 1122 };

    expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any)).toMatchInlineSnapshot(`
          Object {
            "bitrate": Object {
              "average": 1122,
              "max": 0,
              "min": 0,
              "qualityScore": 3,
            },
            "jitter": Object {
              "average": 0,
              "max": NaN,
              "qualityScore": 3,
            },
            "latency": Object {
              "average": 80,
              "max": undefined,
              "qualityScore": 3,
            },
            "packetLoss": Object {
              "average": 5,
              "max": NaN,
              "qualityScore": 2,
            },
            "totalQualityScore": 2,
          }
        `);
  });

  describe('the totalQualityScore variable', () => {
    it('should be QualityScore.Excellent if all quality scores are Excellent', () => {
      const mockPreflightTestReport = {
        stats: { jitter: { average: 0 }, rtt: { average: 80 }, packetLoss: { average: 0 } },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Excellent
      );
    });
    it('should be QualityScore.Bad if one quality score is Bad', () => {
      const mockPreflightTestReport = {
        stats: { jitter: { average: 0 }, rtt: { average: 80 }, packetLoss: { average: 0 } },
      };
      const mockBitrateTest = { averageBitrate: 90 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Bad
      );
    });
    it('should be QualityScore.Good if the lowest score is Good', () => {
      const mockPreflightTestReport = {
        stats: { jitter: { average: 0 }, rtt: { average: 80 }, packetLoss: { average: 2 } },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Good
      );
    });
    it('should be QualityScore.Average if the lowest score is Average', () => {
      const mockPreflightTestReport = {
        stats: { jitter: { average: 0 }, rtt: { average: 80 }, packetLoss: { average: 5 } },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Average
      );
    });
  });
});
