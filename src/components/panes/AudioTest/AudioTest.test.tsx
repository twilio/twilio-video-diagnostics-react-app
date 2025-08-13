import { Button } from '@material-ui/core';
import { mount, shallow } from 'enzyme';

import { AudioTest } from './AudioTest';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import Microphone from '../../../icons/Microphone';
import SpeakerIcon from '../../../icons/SpeakerIcon';
import ProgressBar from './ProgressBar/ProgressBar';
import useAudioTest from './useAudioTest/useAudioTest';
import useDevices from '../../../hooks/useDevices/useDevices';
import * as setSinkIdUtil from '../../../utils/setSinkId';

jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('./useAudioTest/useAudioTest');
jest.mock('../../../hooks/useDevices/useDevices');

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
      setError: jest.fn(),
    };
    mockUseAudioTest.mockImplementation(() => hookProps);
  });

  it('should render correctly', () => {
    const wrapper = shallow(<AudioTest />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should stop the test when active pane is not AudioTest and there is a test in progress', () => {
    mockUseAudioTest.mockImplementationOnce(() => ({ ...hookProps, isAudioOutputTestRunning: true }));
    mockUseAppStateContext.mockImplementationOnce(() => ({ state: { activePane: ActivePane.Connectivity } }));

    mount(<AudioTest />);

    expect(hookProps.stopAudioTest).toHaveBeenCalled();
  });

  it('should stop the test when there is an audio test error', () => {
    mockUseAudioTest.mockImplementationOnce(() => ({
      ...hookProps,
      isAudioOutputTestRunning: true,
      error: 'mockError',
    }));

    mount(<AudioTest />);

    expect(hookProps.stopAudioTest).toHaveBeenCalled();
  });

  describe('passive testing', () => {
    it('should start passive testing by default', () => {
      mount(<AudioTest />);
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '' });
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
      const recordBtn = wrapper.find(Button).at(0);
      recordBtn.simulate('click');
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: 1, enableRecording: true });
    });

    it('should play recorded message when "Play" button is clicked', () => {
      jest.spyOn(setSinkIdUtil, 'isSetSinkIdSupported').mockReturnValueOnce(true);
      const wrapper = mount(<AudioTest />);
      const playBtn = wrapper.find(Button).at(1);
      playBtn.simulate('click');
      expect(hookProps.playAudio).toHaveBeenCalledWith({ deviceId: 3, testURI: 'foo' });
    });

    it('does not pass a deviceId if setSinkId is not available', () => {
      jest.spyOn(setSinkIdUtil, 'isSetSinkIdSupported').mockReturnValueOnce(false);
      const wrapper = mount(<AudioTest />);
      const playBtn = wrapper.find(Button).at(1);
      playBtn.simulate('click');
      expect(hookProps.playAudio).toHaveBeenCalledWith({ testURI: 'foo' });
    });

    it('should go the next pane when "Yes" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const yesBtn = wrapper.find(Button).at(2);
      yesBtn.simulate('click');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
    });

    it('should go the next pane when "Skip for now" button is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const skipBtn = wrapper.find(Button).at(3);
      skipBtn.simulate('click');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
    });

    it('should disable the "Yes" and "Skip for now" buttons when there is an error that is not "No audio detected"', () => {
      mockUseAudioTest.mockImplementation(() => ({ ...hookProps, isAudioInputTestRunning: true, error: 'mockError' }));

      const wrapper = mount(<AudioTest />);
      const yesBtn = wrapper.find(Button).at(2);
      const skipBtn = wrapper.find(Button).at(3);

      expect(yesBtn.prop('disabled')).toBe(true);
      expect(skipBtn.prop('disabled')).toBe(true);
    });

    it('should not disable buttons when there is an error that is not "No audio detected"', () => {
      mockUseAudioTest.mockImplementation(() => ({
        ...hookProps,
        isAudioInputTestRunning: true,
        error: 'No audio detected',
      }));

      const wrapper = mount(<AudioTest />);
      const yesBtn = wrapper.find(Button).at(0);
      const skipBtn = wrapper.find(Button).at(1);

      expect(yesBtn.prop('disabled')).toBe(false);
      expect(skipBtn.prop('disabled')).toBe(false);
    });
  });

  describe('button labels', () => {
    it('should set record button label to "Record"', () => {
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(Button).at(0).text()).toEqual('Record');
    });

    it('should set play button label to "Play back"', () => {
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(Button).at(1).text()).toEqual('Play back');
    });
  });

  describe('volume levels', () => {
    it('should pass inputLevel to ProgressBar when isAudioOutputTestRunning is false', () => {
      hookProps = { ...hookProps, inputLevel: 64, outputLevel: 0, isAudioOutputTestRunning: false };
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(ProgressBar).props().position).toEqual(64);
    });

    it('should pass outputLevel to ProgressBar when isAudioOutputTestRunning is true', () => {
      hookProps = { ...hookProps, inputLevel: 64, outputLevel: 93, isAudioOutputTestRunning: true };
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(ProgressBar).props().position).toEqual(93);
    });

    it('should display the microphone icon when isAudioOutputTestRunning is false', () => {
      hookProps = { ...hookProps, inputLevel: 64, outputLevel: 0, isAudioOutputTestRunning: false };
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(Microphone).exists()).toBe(true);
    });

    it('should display the speaker icon when isAudioOutputTestRunning is true', () => {
      hookProps = { ...hookProps, inputLevel: 64, outputLevel: 93, isAudioOutputTestRunning: true };
      const wrapper = shallow(<AudioTest />);
      expect(wrapper.find(SpeakerIcon).exists()).toBe(true);
    });
  });
});
