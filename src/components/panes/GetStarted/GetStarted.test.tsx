import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import { GetStarted } from './GetStarted';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
mockUseAppStateContext.mockImplementation(() => ({
  state: { appIsExpired: true },
}));

describe('the GetStarted component', () => {
  it('should render correctly when the app has expired', () => {
    const wrapper = shallow(<GetStarted />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should disable the Get Started button when the app has expired', () => {
    const wrapper = shallow(<GetStarted />);
    const getStartedButton = wrapper.find(Button);

    expect(getStartedButton.prop('disabled')).toBe(true);
  });

  it('should render correctly when the app is not expired', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({
      state: { appIsExpired: false },
    }));

    const wrapper = shallow(<GetStarted />);

    expect(wrapper).toMatchSnapshot();
  });
});
