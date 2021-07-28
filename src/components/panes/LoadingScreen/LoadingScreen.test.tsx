import { Container } from '@material-ui/core';
import { shallow, mount } from 'enzyme';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { LoadingScreen } from './LoadingScreen';

jest.mock('../../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the LoadingScreen component', () => {
  it('should be visible if activePane is LoadingScreen and preflightTest has not completed or thrown an error', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.LoadingScreen,
        preflightTest: {
          report: null,
          error: null,
        },
      },
    }));

    const wrapper = shallow(<LoadingScreen />);

    expect(wrapper.find(Container).prop('aria-hidden')).toBe(false);
  });

  it('should not be visible if activePane is not LoadingScreen', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.CameraTest,
        preflightTest: {
          report: null,
        },
      },
    }));

    const wrapper = shallow(<LoadingScreen />);

    expect(wrapper.find(Container).prop('aria-hidden')).toBe(true);
  });

  it('should not be visible if activePane is LoadingScreen and preflightTest has completed', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.LoadingScreen,
        preflightTest: {
          report: 'mockReport',
        },
      },
    }));

    const wrapper = shallow(<LoadingScreen />);

    expect(wrapper.find(Container).prop('aria-hidden')).toBe(true);
  });

  it('should not be visible if activePane is LoadingScreen and preflightTest has an error', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.LoadingScreen,
        preflightTest: {
          error: 'mockError',
        },
      },
    }));

    const wrapper = shallow(<LoadingScreen />);

    expect(wrapper.find(Container).prop('aria-hidden')).toBe(true);
  });

  it('should go to the next pane if preflightTest has completed', () => {
    const mockDispatch = jest.fn();

    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.LoadingScreen,
        preflightTest: {
          report: 'mockReport',
        },
      },
      dispatch: mockDispatch,
    }));

    mount(<LoadingScreen />);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
  });

  it('should go to the next pane if preflightTest throws an error', () => {
    const mockDispatch = jest.fn();

    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.LoadingScreen,
        preflightTest: {
          error: 'mockError',
        },
      },
      dispatch: mockDispatch,
    }));

    mount(<LoadingScreen />);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'next-pane' });
  });
});
