import { mount } from 'enzyme';
import { Button, Select, Typography } from '@material-ui/core';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { CameraTest } from './CameraTest';
import { SmallError } from '../../../icons/SmallError';
import { useCameraTest } from './useCameraTest/useCameraTest';

const mockVideoInputDevices = [
  { deviceId: 1, label: 'Test Device 1' },
  { deviceId: 2, label: 'Test Device 2' },
];

jest.mock('./useCameraTest/useCameraTest');
jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('../../../hooks/useDevices/useDevices', () => () => ({
  videoInputDevices: mockVideoInputDevices,
}));

const mockUseCameraTest = useCameraTest as jest.Mock<any>;
const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

describe('the CameraTest component', () => {
  it('should stop the test when the active pane is not CameraTest and there is a running test', () => {
    const mockStopVideoTest = jest.fn();

    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: ActivePane.GetStarted } }));
    mockUseCameraTest.mockImplementation(() => ({ videoTest: {}, stopVideoTest: mockStopVideoTest }));

    mount(<CameraTest />);

    expect(mockStopVideoTest).toHaveBeenCalled();
  });

  it('should not stop the test when the active pane is CameraTest and there is a running test', () => {
    const mockStopVideoTest = jest.fn();

    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: ActivePane.CameraTest } }));
    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      stopVideoTest: mockStopVideoTest,
      startVideoTest: jest.fn(),
    }));

    mount(<CameraTest />);

    expect(mockStopVideoTest).not.toHaveBeenCalled();
  });

  it('should go to the next pane if "Yes" button is clicked', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: { activePane: ActivePane.CameraTest },
      dispatch: mockDispatch,
    }));

    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      stopVideoTest: jest.fn(),
      startVideoTest: jest.fn(),
    }));

    const wrapper = mount(<CameraTest />);

    wrapper.find(Button).at(0).simulate('click');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
  });

  it('should go to the next pane if "Skip for now" is clicked', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: { activePane: ActivePane.CameraTest },
      dispatch: mockDispatch,
    }));

    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      stopVideoTest: jest.fn(),
      startVideoTest: jest.fn(),
    }));

    const wrapper = mount(<CameraTest />);

    wrapper.find(Button).at(1).simulate('click');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
  });

  it('should restart the test on device change', () => {
    const mockStartVideoTest = jest.fn();

    mockVideoInputDevices.push({ deviceId: 3, label: 'Test Device 3' });

    mockUseAppStateContext.mockImplementation(() => ({
      state: { activePane: ActivePane.CameraTest },
    }));
    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      stopVideoTest: jest.fn(),
      startVideoTest: mockStartVideoTest,
    }));

    const wrapper = mount(<CameraTest />);

    const selectEl = wrapper.find(Select).find('input');
    selectEl.simulate('change', { target: { value: 3 } });

    expect(mockStartVideoTest).toHaveBeenCalled();
    expect(mockStartVideoTest).toHaveBeenCalledTimes(2);
  });

  it('should stop the test when there is an error during the VideoTest', () => {
    const mockStopVideoTest = jest.fn();

    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      startVideoTest: jest.fn(),
      stopVideoTest: mockStopVideoTest,
      videoTestError: Error('mockError'),
    }));

    mount(<CameraTest />);
    expect(mockStopVideoTest).toHaveBeenCalled();
  });

  it('should disable the "Yes" and "Skip for now" buttons when there is an error', () => {
    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      startVideoTest: jest.fn(),
      stopVideoTest: jest.fn(),
      videoTestError: Error('mockError'),
    }));

    const wrapper = mount(<CameraTest />);
    const yesBtn = wrapper.find(Button).at(0);
    const skipBtn = wrapper.find(Button).at(1);

    expect(yesBtn.prop('disabled')).toBe(true);
    expect(skipBtn.prop('disabled')).toBe(true);
  });

  it('should show the error icon and "Unable to connect" when there is a camera test error', () => {
    mockUseCameraTest.mockImplementation(() => ({
      videoTest: {},
      startVideoTest: jest.fn(),
      stopVideoTest: jest.fn(),
      videoTestError: Error('mockError'),
    }));

    const wrapper = mount(<CameraTest />);

    expect(wrapper.find(SmallError).exists()).toBe(true);
    expect(wrapper.find(Typography).find({ children: 'Unable to connect.' }).exists()).toBe(true);
  });
});
