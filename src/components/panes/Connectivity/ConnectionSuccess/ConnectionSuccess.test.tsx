import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';
import { ConnectionSuccess } from './ConnectionSuccess';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 4 }, nextPane: jest.fn() }));

const wrapper = shallow(<ConnectionSuccess serviceStatus="Up" signalingGateway="Reachable" turnServers="Reachable" />);

describe('the ConnectionSuccess component', () => {
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have connection info modal closed by default', () => {
    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(false);
  });

  it('should open connection info modal after "view detailed connection info" is clicked on', () => {
    wrapper.find(Button).at(1).simulate('click');

    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(true);
  });

  it('should prevent modal from being opened if active pane is not Connectivity', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({ state: { activePane: 6 }, nextPane: jest.fn() }));

    const inactivePaneWrapper = shallow(
      <ConnectionSuccess serviceStatus="Up" signalingGateway="Reachable" turnServers="Reachable" />
    );
    const modalButton = inactivePaneWrapper.find(Button).at(1);

    expect(modalButton.prop('className')).toContain('disablePointerEvents');
  });
});
