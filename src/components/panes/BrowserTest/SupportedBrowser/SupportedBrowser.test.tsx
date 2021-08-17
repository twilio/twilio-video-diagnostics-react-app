import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import { SupportedBrowser } from './SupportedBrowser';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  dispatch: mockDispatch,
  userAgentInfo: {
    browser: { major: '92', name: 'Chrome', version: '92.0.4515.131' },
    os: { name: 'Mac OS', version: '10.15.7' },
  },
}));

describe('the Supported Browser component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SupportedBrowser />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should go to the next pane when the "Ok" button is clicked', () => {
    const wrapper = shallow(<SupportedBrowser />);

    wrapper.find(Button).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
  });
});
