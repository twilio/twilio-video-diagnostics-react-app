import { shallow } from 'enzyme';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { QualityScore } from '../Quality';
import { ExcellentQuality } from './ExcellentQuality';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({ nextPane: jest.fn() }));

const mockSetIsModalOpen = jest.fn();

describe('the Excellent Quality component', () => {
  it('should render correctly when quality is "good"', () => {
    const wrapper = shallow(<ExcellentQuality quality={QualityScore.Good} openModal={mockSetIsModalOpen} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when quality is "excellent"', () => {
    const wrapper = shallow(<ExcellentQuality quality={QualityScore.Excellent} openModal={mockSetIsModalOpen} />);
    expect(wrapper).toMatchSnapshot();
  });
});
