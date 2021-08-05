import { shallow } from 'enzyme';
import { SupportedList } from './SupportedList';

describe('the SupportedList component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SupportedList />);

    expect(wrapper).toMatchSnapshot();
  });
});
