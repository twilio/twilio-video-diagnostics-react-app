import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { ConnectionFailed } from './ConnectionFailed';
import * as utils from '../../../../utils';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

jest.mock('../../../AppStateProvider/AppStateProvider');

// @ts-ignore
utils.downloadJSONFile = jest.fn();

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({
  state: { activePane: 4, preflightTest: { report: 'mockReport' } },
  nextPane: jest.fn(),
}));

const mockSetIsModalOpen = jest.fn();

describe('the ConnectionFailed component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ConnectionFailed openModal={mockSetIsModalOpen} signalingGateway="unReachable" turnServers="Reachable" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should download the test results file if "Download report results" is clicked on', () => {
    const wrapper = shallow(
      <ConnectionFailed openModal={mockSetIsModalOpen} signalingGateway="Unreachable" turnServers="Unreachable" />
    );

    wrapper.find(Button).at(0).simulate('click');

    expect(utils.downloadJSONFile).toHaveBeenCalled();
  });
});
