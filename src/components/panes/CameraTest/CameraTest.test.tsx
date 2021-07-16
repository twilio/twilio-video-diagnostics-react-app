import { mount, shallow } from 'enzyme';
import useDevices from '../../../hooks/useDevices/useDevices';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { CameraTest } from './CameraTest';
import { useCameraTest } from './useCameraTest/useCameraTest';

jest.mock('./useCameraTest/useCameraTest');
jest.mock('../../AppStateProvider/AppStateProvider');
jest.mock('../../../hooks/useDevices/useDevices', () => () => ({
  videoInputDevices: [
    { deviceId: 1, label: 'Test Device 1' },
    { deviceId: 2, label: 'Test Device 2' },
  ],
}));
const mockUseCameraTest = useCameraTest as jest.Mock<any>;
const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the CameraTest component', () => {
  it('should stop the test when the active pane is not CameraTest and there is a running test', () => {
    const mockStopVideoTest = jest.fn();
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: ActivePane.GetStarted } }));
    mockUseCameraTest.mockImplementation(() => ({ videoTest: {}, stopVideoTest: mockStopVideoTest }));
    const wrapper = mount(<CameraTest />);
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
    const wrapper = mount(<CameraTest />);
    expect(mockStopVideoTest).not.toHaveBeenCalled();
  });
});
