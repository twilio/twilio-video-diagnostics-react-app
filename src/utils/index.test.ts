import { downloadJSONFile } from './index';
import { getAudioLevelPercentage, getStandardDeviation, round } from './index';

describe('the round function', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(10.236)).toBe(10.24);
    expect(round(2.123)).toBe(2.12);
  });

  it('should round to the specified number of decimal places', () => {
    expect(round(23.678, 0)).toBe(24);
    expect(round(23.378, 0)).toBe(23);
    expect(round(23.378, 1)).toBe(23.4);
    expect(round(23.378124, 3)).toBe(23.378);
  });
});

describe('the getAudioLevelPercentage function', () => {
  [
    { inputLevel: 0, outputPercentage: 0 },
    { inputLevel: 1, outputPercentage: 0.5 },
    { inputLevel: 200, outputPercentage: 100 },
    { inputLevel: 30, outputPercentage: 15 },
  ].forEach(({ inputLevel, outputPercentage }) => {
    it(`should return ${outputPercentage} if input level is ${inputLevel}`, () => {
      expect(getAudioLevelPercentage(inputLevel)).toEqual(outputPercentage);
    });
  });
});

describe('the getStandardDeviation function', () => {
  [
    { stdDev: 0, values: [0, 0, 0, 0] },
    { stdDev: 0, values: [] },
    { stdDev: 12.03, values: [30, 20, 10, 10, 43, 32] },
  ].forEach(({ stdDev, values }) => {
    it(`should return ${stdDev}`, () => {
      expect(getStandardDeviation(values)).toEqual(stdDev);
    });
  });
});
describe('the downloadJSONFile function', () => {
  global.URL.createObjectURL = jest.fn(() => 'mockBlob');

  const mockData = {
    audioTestResults: {},
    browserInformation: 'mockBrowserInfo',
    connectivityResults: 'mockConnectivityResults',
    videoTestResults: 'mockVideoResults',
    preflightTestReport: { report: 'mockReport', error: 'mockError' },
  };

  it('should download the test report file', () => {
    const link = { click: jest.fn() };

    jest.spyOn(document, 'createElement').mockImplementation(() => link as any);

    downloadJSONFile(mockData);

    //@ts-ignore
    expect(link.href).toEqual('mockBlob');
    //@ts-ignore
    expect(link.download).toEqual('test_results.json');
    expect(link.click).toHaveBeenCalledTimes(1);
  });
});
