import { getSingleQualityScore, getQualityScore, formatNumber } from './getQualityScore';
import { QualityScore } from '../Quality';

describe('the getSingleQualityScore function', () => {
  it('should return QualityScore.Excellent when the provided stat is undefined', () => {
    expect(getSingleQualityScore(undefined, 100, 250, 400)).toBe(QualityScore.Excellent);
  });

  it('should return QualityScore.Bad when the provided stat is equal to or over the Bad threshold', () => {
    expect(getSingleQualityScore(500, 100, 250, 400)).toBe(QualityScore.Bad);
  });

  it('should return QualityScore.Average when the provided stat is below the Bad threshold and above the Average threshold', () => {
    expect(getSingleQualityScore(300, 100, 250, 400)).toBe(QualityScore.Average);
  });

  it('should return QualityScore.Good when the provided stat is below the Average threshold and above the Good threshold', () => {
    expect(getSingleQualityScore(120, 100, 250, 400)).toBe(QualityScore.Good);
  });

  it('should return QualityScore.Excellent when the provided stat is below the Good threshold', () => {
    expect(getSingleQualityScore(80, 100, 250, 400)).toBe(QualityScore.Excellent);
  });

  describe('when "descending" is true', () => {
    it('should return QualityScore.Excellent when the provided stat is over the Good threshold', () => {
      expect(getSingleQualityScore(1300, 1000, 500, 150, true)).toBe(QualityScore.Excellent);
    });

    it('should return QualityScore.Good when the provided stat is below the Good threshold and above the Average threshold', () => {
      expect(getSingleQualityScore(800, 1000, 500, 150, true)).toBe(QualityScore.Good);
    });

    it('should return QualityScore.Average when the provided stat is below the Average threshold and above the Bad threshold', () => {
      expect(getSingleQualityScore(300, 1000, 500, 150, true)).toBe(QualityScore.Average);
    });

    it('should return QualityScore.Bad when the provided stat is below the Bad threshold', () => {
      expect(getSingleQualityScore(80, 1000, 500, 150, true)).toBe(QualityScore.Bad);
    });
  });
});

describe('the formatNumber function', () => {
  it('should format numbers to round to 2 decimal places', () => {
    expect(formatNumber(123.6574728376)).toBe('123.66');
  });

  it('should add commas to large numbers', () => {
    expect(formatNumber(123456789123456.6574728376)).toBe('123,456,789,123,456.66');
  });
});

describe('the getQualityScore function', () => {
  it('should return an object containing quality stats and the total quality score', () => {
    const mockPreflightTestReport = {
      stats: {
        jitter: { max: 0.111, average: 0.112 },
        rtt: { max: 116, average: 98.39 },
        packetLoss: { max: 5, average: 2 },
      },
    };
    const mockBitrateTest = { averageBitrate: 1122, values: [10149.876665, 7048.35467, 1203, 667.2345223] };

    expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any)).toMatchInlineSnapshot(`
      Object {
        "bitrate": Object {
          "average": "1,122",
          "max": "10,149.88",
          "min": "667.23",
          "qualityScore": 3,
        },
        "jitter": Object {
          "average": "0.11",
          "max": "0.11",
          "qualityScore": 3,
        },
        "latency": Object {
          "average": "98.39",
          "max": "116",
          "qualityScore": 3,
        },
        "packetLoss": Object {
          "average": "2",
          "max": "5",
          "qualityScore": 2,
        },
        "totalQualityScore": 2,
      }
    `);
  });

  describe('the totalQualityScore variable', () => {
    it('should be QualityScore.Excellent if all quality scores are Excellent', () => {
      const mockPreflightTestReport = {
        stats: {
          jitter: { max: 0, average: 0 },
          rtt: { max: 116, average: 80 },
          packetLoss: { max: 0.677, average: 0 },
        },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Excellent
      );
    });
    it('should be QualityScore.Bad if one quality score is Bad', () => {
      const mockPreflightTestReport = {
        stats: {
          jitter: { max: 10, average: 80 },
          rtt: { max: 200, average: 80 },
          packetLoss: { max: 0.677, average: 0 },
        },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Bad
      );
    });
    it('should be QualityScore.Good if the lowest score is Good', () => {
      const mockPreflightTestReport = {
        stats: {
          jitter: { max: 0.111, average: 0.112 },
          rtt: { max: 116, average: 98.39 },
          packetLoss: { max: 5, average: 2 },
        },
      };
      const mockBitrateTest = { averageBitrate: 1122 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Good
      );
    });
    it('should be QualityScore.Average if the lowest score is Average', () => {
      const mockPreflightTestReport = {
        stats: {
          jitter: { max: 0.111, average: 0.112 },
          rtt: { max: 116, average: 98.39 },
          packetLoss: { max: 0, average: 0 },
        },
      };
      const mockBitrateTest = { averageBitrate: 250 };

      expect(getQualityScore(mockPreflightTestReport as any, mockBitrateTest as any).totalQualityScore).toBe(
        QualityScore.Average
      );
    });
  });
});
