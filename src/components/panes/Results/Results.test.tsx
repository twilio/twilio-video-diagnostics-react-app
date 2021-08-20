import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as utils from '../../../utils';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { getQualityScoreString, Results } from './Results';
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
const mockFinalTestResults = 'mockFinalTestResults';

mockUseAppStateContext.mockImplementation(() => ({
  state: { preflightTest: { report: 'mockReport' }, bitrateTest: { report: 'mockReport' } },
  dispatch: mockDispatch,
  finalTestResults: mockFinalTestResults,
}));

describe('the getQualityScoreString function', () => {
  it('should return "Excellent" when score is QualityScore.Excellent', () => {
    expect(getQualityScoreString(QualityScore.Excellent)).toBe('excellent');
  });

  it('should return "Good" when score is QualityScore.Good', () => {
    expect(getQualityScoreString(QualityScore.Good)).toBe('good');
  });

  it('should return "Average" when score is QualityScore.Average', () => {
    expect(getQualityScoreString(QualityScore.Average)).toBe('average');
  });

  it('should return "Bad" when score is QualityScore.Bad', () => {
    expect(getQualityScoreString(QualityScore.Bad)).toBe('bad');
  });
});

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
  it('should render correctly when score is "average"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Average,
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when score is "bad"', () => {
    mockGetQualityScore.mockImplementationOnce(() => ({
      totalQualityScore: QualityScore.Bad,
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
    it('should down the final results report when "Download report results" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(0).simulate('click');

      expect(utils.downloadJSONFile).toHaveBeenCalledWith(mockFinalTestResults);
    });

    it('should refresh the page when "Restart test" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(1).simulate('click');

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should take user to the camera test when "Review hardware" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(2).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.CameraTest });
    });

    it('should take user to the browser check when "Review browser" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(3).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.BrowserTest });
    });

    it('should take user to the connectivity check when "Review connectivity" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(4).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.Connectivity });
    });

    it('should take user to the quality check when "Review performance" is clicked on', () => {
      const wrapper = shallow(<Results />);
      wrapper.find(Button).at(5).simulate('click');

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: ActivePane.Quality });
    });
  });
});
