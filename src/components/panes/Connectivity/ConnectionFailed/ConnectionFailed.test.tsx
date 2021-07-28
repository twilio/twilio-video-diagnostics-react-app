import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { ConnectionFailed } from './ConnectionFailed';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';
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

describe('the ConnectionFailed component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ConnectionFailed serviceStatus="Up" signalingGateway="unReachable" turnServers="Reachable" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should have connection info modal closed by default', () => {
    const wrapper = shallow(
      <ConnectionFailed serviceStatus="Down" signalingGateway="Reachable" turnServers="Unreachable" />
    );
    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(false);
  });

  it('should open connection info modal after "view detailed connection info" is clicked on', () => {
    const wrapper = shallow(
      <ConnectionFailed serviceStatus="Up" signalingGateway="Unreachable" turnServers="Unreachable" />
    );
    wrapper.find(Button).at(1).simulate('click');
    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(true);
  });

  it('should prevent modal from being opened if active pane is not Connectivity', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: { activePane: 6, preflightTest: { report: 'mockReport' } },
      nextPane: jest.fn(),
    }));

    const inactivePaneWrapper = shallow(
      <ConnectionFailed serviceStatus="Up" signalingGateway="Unreachable" turnServers="Unreachable" />
    );
    const modalButton = inactivePaneWrapper.find(Button).at(1);

    expect(modalButton.prop('className')).toContain('disablePointerEvents');
  });

  it('should download the test results file if "Download report results" is clicked on', () => {
    const wrapper = shallow(
      <ConnectionFailed serviceStatus="Up" signalingGateway="Unreachable" turnServers="Unreachable" />
    );

    wrapper.find(Button).at(0).simulate('click');

    expect(utils.downloadJSONFile).toHaveBeenCalled();
  });
});
