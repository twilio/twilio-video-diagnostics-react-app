import { shallow, mount } from 'enzyme';
import { ExcellentQuality } from './ExcellentQuality/ExcellentQuality';
import { getQualityScore } from './getQualityScore/getQualityScore';
import { PoorQuality } from './PoorQuality/PoorQuality';
import { Quality, QualityScore } from './Quality';
import { QualityModal } from './QualityModal/QualityModal';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { ViewIcon } from '../../../icons/ViewIcon';

jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('./getQualityScore/getQualityScore');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockGetQualityScore = getQualityScore as jest.Mock<any>;

mockUseAppStateContext.mockImplementation(() => ({
  state: {
    preflightTest: {
      report: 'mockReport',
    },
    bitrateTest: {
      report: 'mockReport',
    },
  },
}));

describe('the Quality component', () => {
  it('should render the PoorQuality if the quality score is poor', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Poor,
    }));

    const wrapper = shallow(<Quality />);
    expect(wrapper.find(PoorQuality).exists()).toBe(true);
  });

  it('should render the PoorQuality if the quality score is suboptimal', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Suboptimal,
    }));

    const wrapper = shallow(<Quality />);
    expect(wrapper.find(PoorQuality).exists()).toBe(true);
  });

  it('should render ExcellentQuality if the quality score is excellent', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Excellent,
    }));

    const wrapper = shallow(<Quality />);
    expect(wrapper.find(ExcellentQuality).exists()).toBe(true);
  });

  it('should render ExcellentQuality if the quality score is good', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Good,
    }));

    const wrapper = shallow(<Quality />);
    expect(wrapper.find(ExcellentQuality).exists()).toBe(true);
  });

  it('should open the modal when quality is good and "View detailed quality information" button is clicked on', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Good,
      jitter: {},
      latency: {},
      packetLoss: {},
      bitrate: {},
    }));

    const wrapper = mount(<Quality />);

    expect(wrapper.find(QualityModal).prop('isModalOpen')).toBe(false);

    wrapper.find(ViewIcon).simulate('click');

    expect(wrapper.find(QualityModal).prop('isModalOpen')).toBe(true);
  });

  it('should open the modal when quality is poor and "View detailed quality information" button is clicked on', () => {
    mockGetQualityScore.mockImplementation(() => ({
      totalQualityScore: QualityScore.Poor,
      jitter: {},
      latency: {},
      packetLoss: {},
      bitrate: {},
    }));

    const wrapper = mount(<Quality />);

    expect(wrapper.find(QualityModal).prop('isModalOpen')).toBe(false);

    wrapper.find(ViewIcon).simulate('click');

    expect(wrapper.find(QualityModal).prop('isModalOpen')).toBe(true);
  });
});
