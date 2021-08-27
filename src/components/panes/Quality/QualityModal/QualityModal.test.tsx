import { shallow } from 'enzyme';
import { QualityScore } from '../Quality';
import { QualityModal } from './QualityModal';
import { ErrorStatus, SuccessStatus } from '../../../../icons/StatusIcons';

const mockJitter = { average: '0', max: '3', qualityScore: QualityScore.Excellent };
const mockLatency = { average: '85.2', max: '192', qualityScore: QualityScore.Excellent };
const mockPacketLoss = { average: '0', max: '2', qualityScore: QualityScore.Excellent };
const mockBitrate = { average: '11,608.06', max: '8,333.98', min: '3,612.67', qualityScore: QualityScore.Excellent };

describe('the QualityModal component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <QualityModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        jitter={mockJitter}
        latency={mockLatency}
        packetLoss={mockPacketLoss}
        bitrate={mockBitrate}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should use the success icons for "good" and "excellent" quality scores', () => {
    const wrapper = shallow(
      <QualityModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        jitter={mockJitter}
        latency={mockLatency}
        packetLoss={mockPacketLoss}
        bitrate={mockBitrate}
      />
    );

    expect(wrapper.find(SuccessStatus).exists()).toBe(true);
    expect(wrapper.find(ErrorStatus).exists()).toBe(false);
  });

  it('should use the error icons for "poor" and "suboptimal" quality scores', () => {
    const wrapper = shallow(
      <QualityModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        jitter={mockJitter}
        latency={{ ...mockLatency, qualityScore: QualityScore.Poor }}
        packetLoss={mockPacketLoss}
        bitrate={{ ...mockBitrate, qualityScore: QualityScore.Suboptimal }}
      />
    );
    expect(wrapper.find(ErrorStatus).exists()).toBe(true);
  });
});
