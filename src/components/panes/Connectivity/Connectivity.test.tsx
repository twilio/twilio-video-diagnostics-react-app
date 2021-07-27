import { Connectivity } from './Connectivity';
import { ConnectionFailed } from './ConnectionFailed/ConnectionFailed';
import { ConnectionSuccess } from './ConnectionSuccess/ConnectionSuccess';
import { shallow } from 'enzyme';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the Connectivity component', () => {
  it('should render ConnectionFailed component if connection has failed', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: {
        activePane: 4,
        twilioStatus: 'operational',
        preflightTest: {
          progress: 'connected',
        },
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
        },
      },
    }));
    const wrapper = shallow(<Connectivity />);
    expect(wrapper.find(ConnectionSuccess).exists()).toBe(true);
  });
});
