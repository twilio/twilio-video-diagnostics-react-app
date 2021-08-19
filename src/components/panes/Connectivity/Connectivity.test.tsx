import { shallow, mount } from 'enzyme';
import { Connectivity } from './Connectivity';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';
import { ConnectionModal } from './ConnectionModal/ConnectionModal';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { ViewIcon } from '../../../icons/ViewIcon';

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the Connectivity component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should show the loading screen if bitrate test is running', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          signalingGatewayReachable: false,
          turnServersReachable: false,
        },
        bitrateTestInProgress: true,
        bitrateTestFinished: false,
      },
    }));

    const wrapper = shallow(<Connectivity />);

    expect(wrapper.text().includes('Hang Tight!')).toBe(true);
  });

  it('should hide the loading screen if preflight test and bitrate test have completed', () => {
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
        bitrateTestInProgress: false,
        bitrateTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.text().includes('Hang Tight!')).toBe(false);
  });

  it('should render ConnectionFailed component if Twilio status is not "operational"', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'major_outage',
        preflightTest: {
          progress: null,
          signalingGatewayReachable: true,
          turnServersReachable: true,
          error: null,
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.find(ConnectionFailed).exists()).toBe(true);
  });

  it('should render ConnectionFailed component if there is a preflight test error', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: null,
          signalingGatewayReachable: true,
          turnServersReachable: true,
          error: 'mockError',
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.find(ConnectionFailed).exists()).toBe(true);
  });

  it('should render ConnectionFailed component if signaling gateway or turn servers are not reachable', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: null,
          signalingGatewayReachable: false,
          turnServersReachable: true,
          error: null,
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

  it('should open the modal when connection is successful and "View detailed connection information" button is clicked on', () => {
    mockUseAppStateContext.mockImplementation(() => ({
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

    const wrapper = mount(<Connectivity />);

    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(false);

    wrapper.find(ViewIcon).simulate('click');

    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(true);
  });

  it('should open the modal when connection failed and "View detailed connection information" button is clicked on', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: 'connected',
          signalingGatewayReachable: true,
          turnServersReachable: false,
          error: 'mockError',
        },
        preflightTestInProgress: false,
        preflightTestFinished: true,
      },
    }));

    const wrapper = mount(<Connectivity />);

    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(false);

    wrapper.find(ViewIcon).simulate('click');

    expect(wrapper.find(ConnectionModal).prop('isModalOpen')).toBe(true);
  });
});
