import { shallow } from 'enzyme';
import { ConnectionModal } from './ConnectionModal';
import { ErrorStatus, SuccessStatus } from '../../../../icons/StatusIcons';

describe('the ConnectionModal component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatus="Up"
        signalingGateway="Reachable"
        turnServers="Reachable"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should only use the success icons when when there are no errors', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatus="Up"
        signalingGateway="Reachable"
        turnServers="Reachable"
      />
    );

    expect(wrapper.find(SuccessStatus).exists()).toBe(true);
    expect(wrapper.find(ErrorStatus).exists()).toBe(false);
  });

  it('should use the error icons for each item that has an error', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatus="Down"
        signalingGateway="Reachable"
        turnServers="Unreachable"
      />
    );
    expect(wrapper.find(ErrorStatus).exists()).toBe(true);
  });
});
