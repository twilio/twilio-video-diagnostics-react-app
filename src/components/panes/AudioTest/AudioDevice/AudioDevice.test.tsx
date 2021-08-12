import { Select, Typography } from '@material-ui/core';
import { render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import { ActivePane, useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { AudioDevice } from './AudioDevice';
import useDevices from '../../../../hooks/useDevices/useDevices';

jest.mock('../../../AppStateProvider/AppStateProvider');
jest.mock('../../../../hooks/useDevices/useDevices');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockUseDevices = useDevices as jest.Mock<any>;

const mediaInfoProps = { groupId: 'foo', toJSON: () => {} };
const mockDevices = {
  audioInputDevices: [
    {
      deviceId: 'input1',
      label: 'deviceinput1',
      kind: 'audioinput',
      ...mediaInfoProps,
    },
  ],
  videoInputDevices: [],
  audioOutputDevices: [
    {
      deviceId: 'output1',
      label: 'deviceoutput1',
      kind: 'audiooutput',
      ...mediaInfoProps,
    },
  ],
};

mockUseAppStateContext.mockImplementation(() => ({
  state: {
    activePane: ActivePane.AudioTest,
  },
}));
mockUseDevices.mockImplementation(() => mockDevices);

describe('the AudioDevice component', () => {
  const noop = () => {};
  let originalAudio: any;
  let mockAudio: any;

  beforeEach(() => {
    mockAudio = {
      prototype: {
        setSinkId: true,
      },
    };
    originalAudio = global.Audio;
    global.Audio = mockAudio;
  });

  afterEach(() => {
    global.Audio = originalAudio;
  });

  it('should render default audio output if audio redirect is not supported', () => {
    mockAudio.prototype.setSinkId = false;
    const wrapper = shallow(<AudioDevice disabled={false} kind="audiooutput" onDeviceChange={noop} />);
    expect(wrapper.find(Select).exists()).toBeFalsy();
    expect(wrapper.find(Typography).at(1).text()).toEqual('System Default Audio Output');
  });

  describe('props.disabled', () => {
    it('should disable dropdown if disabled=true', () => {
      const { container } = render(<AudioDevice disabled={true} kind="audioinput" onDeviceChange={noop} />);
      const el = container.querySelector('.MuiInputBase-root') as HTMLDivElement;
      expect(el.className.includes('Mui-disabled')).toBeTruthy();
    });
    it('should not disable dropdown if disabled=false', () => {
      const { container } = render(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={noop} />);
      const el = container.querySelector('.MuiInputBase-root') as HTMLDivElement;
      expect(el.className.includes('Mui-disabled')).toBeFalsy();
    });
  });

  describe('props.kind', () => {
    it('should render input devices if kind is audioinput', () => {
      const wrapper = shallow(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={noop} />);
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceinput1');
    });
    it('should render output devices if kind is audiooutput', () => {
      const wrapper = shallow(<AudioDevice disabled={false} kind="audiooutput" onDeviceChange={noop} />);
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceoutput1');
    });
  });

  describe('props.onDeviceChange', () => {
    let onDeviceChange: () => any;

    beforeEach(() => {
      onDeviceChange = jest.fn();
    });

    it('should trigger onDeviceChange when devices are present', () => {
      mount(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={onDeviceChange} />);
      expect(onDeviceChange).toHaveBeenCalled();
    });

    it('should trigger onDeviceChange when a new device is selected', () => {
      mockDevices.audioInputDevices.push({
        deviceId: 'input2',
        label: 'deviceinput2',
        kind: 'audioinput',
        ...mediaInfoProps,
      });

      const wrapper = mount(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={onDeviceChange} />);
      expect(onDeviceChange).toHaveBeenCalledWith('input1');

      const selectEl = wrapper.find(Select).find('input');
      selectEl.simulate('change', { target: { value: 'input2' } });
      expect(onDeviceChange).toHaveBeenCalledWith('input2');
      expect(onDeviceChange).toHaveBeenCalledTimes(2);
    });
  });
});
