import { shallow } from 'enzyme';
import { ConnectionModal, TwilioStatusRow } from './ConnectionModal';
import { ErrorStatus, SuccessStatus, WarningStatus } from '../../../../icons/StatusIcons';
import { TwilioStatus } from '../../../AppStateProvider/AppStateProvider';

const mockServiceStatuses: TwilioStatus = {
  'Group Rooms': 'operational',
  'Go Rooms': 'operational',
  'Peer-to-Peer Rooms': 'operational',
  Recordings: 'operational',
  Compositions: 'operational',
  'Network Traversal Service': 'operational',
};

describe('the TwilioStatusRow component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<TwilioStatusRow status="operational" serviceName="Compositions" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should use the success icons when a service status is "operational"', () => {
    const wrapper = shallow(<TwilioStatusRow status="operational" serviceName="Compositions" />);
    expect(wrapper.find(SuccessStatus).exists()).toBe(true);
  });

  it('should use the error icons when a service status is major_outage', () => {
    const wrapper = shallow(<TwilioStatusRow status="major_outage" serviceName="Group Rooms" />);
    expect(wrapper.find(ErrorStatus).exists()).toBe(true);
  });

  it('should use the warning icons when a service status is partial_outage', () => {
    const wrapper = shallow(<TwilioStatusRow status="partial_outage" serviceName="Compositions" />);
    expect(wrapper.find(WarningStatus).exists()).toBe(true);
  });

  it('should use the warning icons when a service status is degraded_performance', () => {
    const wrapper = shallow(<TwilioStatusRow status="degraded_performance" serviceName="Go Rooms" />);
    expect(wrapper.find(WarningStatus).exists()).toBe(true);
  });
});

describe('the ConnectionModal component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatuses={mockServiceStatuses}
        signalingGateway="Reachable"
        turnServers="Reachable"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should only use the success icons when signalingGateway and turnServers are "Reachable"', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatuses={mockServiceStatuses}
        signalingGateway="Reachable"
        turnServers="Reachable"
      />
    );

    expect(wrapper.find(SuccessStatus).exists()).toBe(true);
    expect(wrapper.find(ErrorStatus).exists()).toBe(false);
  });

  it('should use the error icons when signalingGateway and turnServers are "Unreachable"', () => {
    const wrapper = shallow(
      <ConnectionModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        serviceStatuses={mockServiceStatuses}
        signalingGateway="Unreachable"
        turnServers="Unreachable"
      />
    );
    expect(wrapper.find(ErrorStatus).exists()).toBe(true);
  });
});
