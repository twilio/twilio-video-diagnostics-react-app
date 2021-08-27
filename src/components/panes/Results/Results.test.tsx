import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as utils from '../../../utils';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { Results } from './Results';
import { getQualityScore } from '../Quality/getQualityScore/getQualityScore';
import { QualityScore } from '../Quality/Quality';

// @ts-ignore
utils.downloadJSONFile = jest.fn();

//@ts-ignore
delete window.location;

//@ts-ignore
window.location = { reload: jest.fn() };

jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('../Quality/getQualityScore/getQualityScore');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockGetQualityScore = getQualityScore as jest.Mock<any>;

const mockDispatch = jest.fn();
const mockDownloadFinalTestResults = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  state: { preflightTest: { report: 'mockReport' }, bitrateTest: { report: 'mockReport' } },
  dispatch: mockDispatch,
  downloadFinalTestResults: mockDownloadFinalTestResults,
}));

describe('the GetResults component', () => {
  it('should render correctly when score is "excellent"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Excellent,
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when score is "good"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Good,
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when score is "suboptimal"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Suboptimal,
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when score is "poor"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Poor,
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('the button clicks', () => {
    beforeEach(() => {
      mockGetQualityScore.mockImplementationOnce(() => ({
        totalQualityScore: QualityScore.Good,
      }));
    });
    it('should download the final results report when "Download report results" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(0).simulate('click');

      expect(mockDownloadFinalTestResults).toHaveBeenCalled();
    });

    it('should refresh the page when "Restart test" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).find({ children: 'Restart test' }).simulate('click');

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should take user to the camera test when "Review hardware" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).find({ children: 'Review hardware' }).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.CameraTest });
    });

    it('should take user to the browser check when "Review browser" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).find({ children: 'Review browser' }).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.BrowserTest });
    });

    it('should take user to the connectivity check when "Review connectivity" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).find({ children: 'Review connectivity' }).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.Connectivity });
    });

    it('should take user to the quality check when "Review performance" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).find({ children: 'Review performance' }).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.Quality });
    });
  });
});
