import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import { SupportedBrowser } from './SupportedBrowser';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

Object.defineProperty(navigator, 'userAgent', {
  value:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
});

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  dispatch: mockDispatch,
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
