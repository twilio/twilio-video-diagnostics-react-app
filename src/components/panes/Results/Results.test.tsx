import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import * as utils from '../../../utils';
import { Results } from './Results';
import { useAppStateContext, ActivePane } from '../../AppStateProvider/AppStateProvider';

// @ts-ignore
utils.downloadJSONFile = jest.fn();

//@ts-ignore
delete window.location;

//@ts-ignore
window.location = { reload: jest.fn() };

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockUseGetQualityScore = useAppStateContext as jest.Mock<any>;

const mockDispatch = jest.fn();
const mockFinalTestResults = 'mockFinalTestResults';

mockUseAppStateContext.mockImplementation(() => ({
  state: { preflightTest: { report: 'mockReport' }, bitrateTest: { report: 'mockReport' } },
  dispatch: mockDispatch,
  finalTestResults: mockFinalTestResults,
}));

describe('the GetResults component', () => {
  it('should render correctly when score is "excellent"', () => {
    mockUseGetQualityScore.mockImplementationOnce(() => ({
      qualityScore: 'excellent',
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when score is "good"', () => {
    mockUseGetQualityScore.mockImplementationOnce(() => ({
      qualityScore: 'good',
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render correctly when score is "average"', () => {
    mockUseGetQualityScore.mockImplementationOnce(() => ({
      qualityScore: 'average',
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when score is "bad"', () => {
    mockUseGetQualityScore.mockImplementationOnce(() => ({
      qualityScore: 'bad',
    }));
    const wrapper = shallow(<Results />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('the button clicks', () => {
    beforeEach(() => {
      mockUseGetQualityScore.mockImplementationOnce(() => ({
        qualityScore: 'good',
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
