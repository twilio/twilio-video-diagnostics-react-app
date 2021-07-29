import { Button } from '@material-ui/core';
import { mount, shallow } from 'enzyme';

import { AudioDevice } from './AudioDevice/AudioDevice';
import AudioTest from './AudioTest';
import ProgressBar from './ProgressBar/ProgressBar';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import useTestRunner from './useTestRunner/useTestRunner';

jest.mock('./AudioDevice/AudioDevice');
jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('./useTestRunner/useTestRunner');

const mockAudioDevice = AudioDevice as jest.Mock<any>;
const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockUseTestRunner = useTestRunner as jest.Mock<any>;

const mockDispatch = jest.fn();

mockUseAppStateContext.mockImplementation(() => ({
  state: { activePane: ActivePane.AudioTest },
  dispatch: mockDispatch,
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
    mockUseTestRunner.mockImplementation(() => hookProps);
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

  it('should stop the audio test when active pane is not AudioTest', () => {
    mockUseAppStateContext.mockImplementationOnce(() => ({ state: { activePane: ActivePane.Connectivity } }));

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
          expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '' });
        } else {
          expect(hookProps.readAudioInput).not.toHaveBeenCalledWith({ deviceId: '' });
        }
      });
    });
  });

  describe('button clicks', () => {
    beforeEach(() => {
      hookProps = { ...hookProps, isAudioInputTestRunning: true, playbackURI: 'foo' };
    });

    it('should start recording when record is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const recordBtn = wrapper.find(Button).at(2);
      recordBtn.simulate('click');
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '', enableRecording: true });
    });

    it('should play recorded click when play is clicked', () => {
      const wrapper = mount(<AudioTest />);
      const playBtn = wrapper.find(Button).at(3);
      playBtn.simulate('click');
      expect(hookProps.playAudio).toHaveBeenCalledWith({ deviceId: '', testURI: 'foo' });
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
