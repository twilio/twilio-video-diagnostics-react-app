import { shallow } from 'enzyme';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { QualityScore } from '../Quality';
import { PoorQuality } from './PoorQuality';

jest.mock('../../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({ nextPane: jest.fn() }));

const mockSetIsModalOpen = jest.fn();

describe('the PoorQuality component', () => {
  it('should render correctly when quality is "bad"', () => {
    const wrapper = shallow(<PoorQuality quality={QualityScore.Bad} openModal={mockSetIsModalOpen} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when quality is "average"', () => {
    const wrapper = shallow(<PoorQuality quality={QualityScore.Average} openModal={mockSetIsModalOpen} />);
    expect(wrapper).toMatchSnapshot();
  });
});
