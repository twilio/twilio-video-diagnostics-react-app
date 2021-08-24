import { shallow } from 'enzyme';
import { ConnectionModal, determineStatus, TwilioStatusRow } from './ConnectionModal';
import { ErrorStatus, SuccessStatus, WarningStatus } from '../../../../icons/StatusIcons';

const mockServiceStatuses = {
  groupRooms: 'operational',
  goRooms: 'operational',
  peerToPeerRooms: 'operational',
  recordings: 'operational',
  compositions: 'operational',
  networkTraversal: 'operational',
};

describe('the determineStatus function', () => {
  it('should return an object with status "Up" and "Success" icon when status is "operational"', () => {
    expect(determineStatus('operational')).toEqual({ status: 'Up', icon: <SuccessStatus /> });
  });
  it('should return an object with status "Major Outage" and "Error" icon when status is "major_outage"', () => {
    expect(determineStatus('major_outage')).toEqual({ status: 'Major Outage', icon: <ErrorStatus /> });
  });
  it('should return an object with status "Partial Outage" and "Warning" icon when status is "partial_outage"', () => {
    expect(determineStatus('partial_outage')).toEqual({ status: 'Partial Outage', icon: <WarningStatus /> });
  });
  it('should return an object with status "Degraded" and "Warning" icon when status is "degraded_performance"', () => {
    expect(determineStatus('degraded_performance')).toEqual({ status: 'Degraded', icon: <WarningStatus /> });
  });
});

describe('the TwilioStatusRow component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<TwilioStatusRow status="operational" serviceName="Compositions" />);

    expect(wrapper).toMatchSnapshot();
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
