import { downloadJSONFile } from './index';

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
    expect(link.download).toEqual('test_results.txt');
    expect(link.click).toHaveBeenCalledTimes(1);
  });
});
