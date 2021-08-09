import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { ConnectionSuccess } from './ConnectionSuccess';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 4 }, nextPane: jest.fn() }));

const mockSetIsModalOpen = jest.fn();

const wrapper = shallow(<ConnectionSuccess openModal={mockSetIsModalOpen} />);

describe('the ConnectionSuccess component', () => {
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should open connection info modal after "view detailed connection info" is clicked on', () => {
    wrapper.find(Button).at(1).simulate('click');

    expect(mockSetIsModalOpen).toHaveBeenCalled();
  });
});
