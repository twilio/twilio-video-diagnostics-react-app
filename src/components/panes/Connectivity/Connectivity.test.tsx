import { shallow } from 'enzyme';
import { Connectivity } from './Connectivity';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the Connectivity component', () => {
  it('should show the loading screen if preflight test is running', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          signalingGatewayReachable: false,
          turnServersReachable: false,
        },
        preflightTestInProgress: true,
        preflightTestFinished: false,
      },
    }));

    const wrapper = shallow(<Connectivity />);

    expect(wrapper.text().includes('Hang Tight!')).toBe(true);
  });

  it('should hide the loading screen if preflight test has completed', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          signalingGatewayReachable: true,
          turnServersReachable: true,
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.text().includes('Hang Tight!')).toBe(false);
  });

  it('should render ConnectionFailed component if connection has failed', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: 'connected',
          signalingGatewayReachable: false,
          turnServersReachable: true,
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.find(ConnectionFailed).exists()).toBe(true);
  });

  it('should render ConnectionSucess component if connection is successful', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: null,
          report: 'mockReport',
          signalingGatewayReachable: true,
          turnServersReachable: true,
          error: null,
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.find(ConnectionSuccess).exists()).toBe(true);
  });
});
