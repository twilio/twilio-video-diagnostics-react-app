import Header from './Header';
import { shallow, mount } from 'enzyme';
import { useAppStateContext } from '../AppStateProvider/AppStateProvider';

jest.mock('../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the Header component', () => {
  it('should show two active HeaderItems when the activePane is 4', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: { activePane: 4 },
    }));
    const wrapper = mount(<Header />);

    expect(wrapper.find({ label: 'Device & Network Setup' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Connectivity' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Quality & Performance' }).find('div').at(0).prop('className')).not.toContain(
      'active'
    );
    expect(wrapper.find({ label: 'Get Results' }).find('div').at(0).prop('className')).not.toContain('active');
  });

  it('should show four active HeaderItems when the activePane is 7', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 7 } }));
    const wrapper = mount(<Header />);

    expect(wrapper.find({ label: 'Device & Network Setup' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Connectivity' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Quality & Performance' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Get Results' }).find('div').at(0).prop('className')).toContain('active');
  });

  it('should display the progress bar at 20% when the activePane is 1', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 1 } }));
    const wrapper = shallow(<Header />);
    expect(wrapper.find('div').at(2).prop('style')).toEqual({ width: '20%' });
  });

  it('should display the progress bar at 50% when the activePane is 3', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 3 } }));
    const wrapper = shallow(<Header />);
    expect(wrapper.find('div').at(2).prop('style')).toEqual({ width: '60%' });
  });
});
