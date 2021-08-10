import { Button } from '@material-ui/core';
import { mount, shallow } from 'enzyme';

import { AudioDevice } from './AudioDevice/AudioDevice';
import { AudioTest } from './AudioTest';
import ProgressBar from './ProgressBar/ProgressBar';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import useAudioTest from './useAudioTest/useAudioTest';
import useDevices from '../../../hooks/useDevices/useDevices';

jest.mock('./AudioDevice/AudioDevice');
jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('./useAudioTest/useAudioTest');
jest.mock('../../../hooks/useDevices/useDevices');

const mockAudioDevice = AudioDevice as jest.Mock<any>;
const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockUseAudioTest = useAudioTest as jest.Mock<any>;
const mockUseDevices = useDevices as jest.Mock<any>;

const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  state: { activePane: ActivePane.AudioTest },
  dispatch: mockDispatch,
}));

mockUseDevices.mockImplementation(() => ({
  audioInputDevices: [
    { deviceId: 1, label: 'mockInput1' },
    { deviceId: 2, label: 'mockInput2' },
  ],
  videoInputDevices: [],
  audioOutputDevices: [
    { deviceId: 3, label: 'mockOutput3' },
    { deviceId: 4, label: 'mockOutput4' },
  ],
}));

describe('the AudioTest component', () => {
  let hookProps: any;

  beforeEach(() => {
    hookProps = {
      error: '',
      inputLevel: 0,
      isRecording: false,
      isAudioInputTestRunning: false,
      isAudioOutputTestRunning: false,
      outputLevel: 0,
      playAudio: jest.fn(),
      playbackURI: '',
      readAudioInput: jest.fn(),
      testEnded: false,
      stopAudioTest: jest.fn(),
    };
    mockUseAudioTest.mockImplementation(() => hookProps);
    mockAudioDevice.mockImplementation(() => null);
  });

  it('should render correct components on load', () => {
    const wrapper = shallow(<AudioTest />);
    expect(wrapper.find(AudioDevice).length).toEqual(2);

    const outputDevice = wrapper.find(AudioDevice).at(0);
    const inputDevice = wrapper.find(AudioDevice).at(1);
    const recordBtn = wrapper.find(Button).at(2);
    const playBtn = wrapper.find(Button).at(3);

    expect(outputDevice.prop('disabled')).toBeFalsy();
    expect(inputDevice.prop('disabled')).toBeFalsy();
    expect(recordBtn.prop('disabled')).toBeFalsy();
    expect(playBtn.prop('disabled')).toBeTruthy();
    expect(recordBtn.text()).toEqual('Record');
    expect(playBtn.text()).toEqual('Play back');
  });

  it('should stop the test when active pane is not AudioTest and there is a test in progress', () => {
    mockUseAudioTest.mockImplementationOnce(() => ({ ...hookProps, isAudioOutputTestRunning: true }));
    mockUseAppStateContext.mockImplementationOnce(() => ({ state: { activePane: ActivePane.Connectivity } }));

    mount(<AudioTest />);

    expect(hookProps.stopAudioTest).toHaveBeenCalled();
  });

  describe('passive testing', () => {
    it('should start passive testing by default', () => {
      mount(<AudioTest />);
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: 1 });
    });

    [
      {
        shouldBeCalled: true,
        props: { error: '', isRecording: false, isAudioInputTestRunning: false },
      },
      {
        shouldBeCalled: false,
        props: { error: '', isRecording: true, isAudioInputTestRunning: false },
      },
      {
        shouldBeCalled: false,
        props: { error: '', isRecording: false, isAudioInputTestRunning: true },
      },
      {
        shouldBeCalled: false,
        props: { error: '', isRecording: true, isAudioInputTestRunning: true },
      },
      {
        shouldBeCalled: false,
        props: { error: 'foo', isRecording: false, isAudioInputTestRunning: false },
      },
      {
        shouldBeCalled: false,
        props: { error: 'foo', isRecording: true, isAudioInputTestRunning: false },
      },
      {
        shouldBeCalled: false,
        props: { error: 'foo', isRecording: false, isAudioInputTestRunning: true },
      },
      {
        shouldBeCalled: false,
        props: { error: 'foo', isRecording: true, isAudioInputTestRunning: true },
      },
    ].forEach(({ shouldBeCalled, props }) => {
      it(`should${shouldBeCalled ? ' ' : ' not '}call readAudioInput when props are ${JSON.stringify(props)}`, () => {
        hookProps = { ...hookProps, ...props };
        mount(<AudioTest />);

        if (shouldBeCalled) {
          expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '' }); // eslint-disable-line
        } else {
          expect(hookProps.readAudioInput).not.toHaveBeenCalledWith({ deviceId: '' }); // eslint-disable-line
        }
      });
    });
  });

  describe('button clicks', () => {
    beforeEach(() => {
      hookProps = { ...hookProps, isAudioInputTestRunning: true, playbackURI: 'foo' };
    });

    it('should start recording when "Record" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const recordBtn = wrapper.find(Button).at(2);
      recordBtn.simulate('click');
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: 1, enableRecording: true });
    });

    it('should play recorded message when "Play" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const playBtn = wrapper.find(Button).at(3);
      playBtn.simulate('click');
      expect(hookProps.playAudio).toHaveBeenCalledWith({ deviceId: 3, testURI: 'foo' });
    });

    it('should go the next pane when "Yes" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const yesBtn = wrapper.find(Button).at(0);
      yesBtn.simulate('click');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
    });

    it('should go the next pane when "Skip for now" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const skipBtn = wrapper.find(Button).at(1);
      skipBtn.simulate('click');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
    });
  });

  describe('button labels', () => {
    it('should set record button label to "Record"', () => {
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(Button).at(2).text()).toEqual('Record');
    });

    it('should set play button label to "Play back"', () => {
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(Button).at(3).text()).toEqual('Play back');
    });
  });

  describe('audio levels', () => {
    it('should pass input levels to ProgressBar', () => {
      hookProps = { ...hookProps, inputLevel: 64 };
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(ProgressBar).props().position).toEqual(64);
    });
  });
});
