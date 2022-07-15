import { Select, Typography } from '@material-ui/core';
import { render, screen } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import { AudioDevice } from './AudioDevice';
import { SmallError } from '../../../../icons/SmallError';
import useDevices from '../../../../hooks/useDevices/useDevices';

jest.mock('../../../../hooks/useDevices/useDevices');

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
    const wrapper = shallow(
      <AudioDevice disabled={false} kind="audiooutput" onDeviceChange={noop} setDeviceError={noop} />
    );
    expect(wrapper.find(Select).exists()).toBe(false);
    expect(wrapper.find(Typography).at(1).text()).toEqual('System Default Audio Output');
  });

  it('should show the error icon and "Unable to connect" when there is an audio test error', () => {
    const wrapper = shallow(
      <AudioDevice disabled={false} kind="audiooutput" onDeviceChange={noop} error="mockError" setDeviceError={noop} />
    );

    expect(wrapper.find(SmallError).exists()).toBe(true);
    expect(wrapper.find(Typography).find({ children: 'Unable to connect.' }).exists()).toBe(true);
  });

  it('should show the error icon and "No audio detected" the input device does not receive audio', () => {
    const wrapper = shallow(
      <AudioDevice
        disabled={false}
        kind="audiooutput"
        onDeviceChange={noop}
        error="No audio detected"
        setDeviceError={noop}
      />
    );

    expect(wrapper.find(SmallError).exists()).toBe(true);
    expect(wrapper.find(Typography).find({ children: 'No audio detected.' }).exists()).toBe(true);
  });

  describe('props.disabled', () => {
    it('should disable dropdown if disabled=true', () => {
      render(<AudioDevice disabled={true} kind="audioinput" onDeviceChange={noop} setDeviceError={noop} />);

      const dropDown = screen.getByRole('button');
      expect(dropDown.className.includes('Mui-disabled')).toBe(true);
    });

    it('should not disable dropdown if disabled=false', () => {
      render(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={noop} setDeviceError={noop} />);

      const dropDown = screen.getByRole('button');
      expect(dropDown.className.includes('Mui-disabled')).toBe(false);
    });
  });

  describe('props.kind', () => {
    it('should render input devices if kind is audioinput', () => {
      const wrapper = shallow(
        <AudioDevice disabled={false} kind="audioinput" onDeviceChange={noop} setDeviceError={noop} />
      );
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceinput1');
    });
    it('should render output devices if kind is audiooutput', () => {
      const wrapper = shallow(
        <AudioDevice disabled={false} kind="audiooutput" onDeviceChange={noop} setDeviceError={noop} />
      );
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceoutput1');
    });
  });

  describe('props.onDeviceChange', () => {
    let onDeviceChange: () => any;

    beforeEach(() => {
      onDeviceChange = jest.fn();
    });

    it('should trigger onDeviceChange when devices are present', () => {
      mount(<AudioDevice disabled={false} kind="audioinput" onDeviceChange={onDeviceChange} setDeviceError={noop} />);
      expect(onDeviceChange).toHaveBeenCalled();
    });

    it('should trigger onDeviceChange when a new device is selected', () => {
      mockDevices.audioInputDevices.push({
        deviceId: 'input2',
        label: 'deviceinput2',
        kind: 'audioinput',
        ...mediaInfoProps,
      });

      const wrapper = mount(
        <AudioDevice disabled={false} kind="audioinput" onDeviceChange={onDeviceChange} setDeviceError={noop} />
      );
      expect(onDeviceChange).toHaveBeenCalledWith('input1');

      const selectEl = wrapper.find(Select).find('input');
      selectEl.simulate('change', { target: { value: 'input2' } });
      expect(onDeviceChange).toHaveBeenCalledWith('input2');
      expect(onDeviceChange).toHaveBeenCalledTimes(2);
    });

    it('should reset the device error when onDeviceChange is called', () => {
      const mockSetDeviceError = jest.fn();
      mount(
        <AudioDevice
          disabled={false}
          kind="audioinput"
          onDeviceChange={onDeviceChange}
          setDeviceError={mockSetDeviceError}
        />
      );
      expect(mockSetDeviceError).toHaveBeenCalledWith('');
    });
  });
});
