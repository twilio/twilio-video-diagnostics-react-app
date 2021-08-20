import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { ConnectionFailed } from './ConnectionFailed';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDownloadFinalTestResults = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  state: { activePane: 4, preflightTest: { report: 'mockReport' } },
  nextPane: jest.fn(),
  downloadFinalTestResults: mockDownloadFinalTestResults,
}));

const mockSetIsModalOpen = jest.fn();

describe('the ConnectionFailed component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ConnectionFailed openModal={mockSetIsModalOpen} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should download the test results file if "Download report results" is clicked on', () => {
    const wrapper = shallow(<ConnectionFailed openModal={mockSetIsModalOpen} />);

    wrapper.find(Button).at(0).simulate('click');

    expect(mockDownloadFinalTestResults).toHaveBeenCalled();
  });
});
