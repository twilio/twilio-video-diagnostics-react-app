import { shallow, mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import { MuiThemeProvider } from '@material-ui/core';
import Video from 'twilio-video';
import { ActivePane, useAppStateContext } from '../AppStateProvider/AppStateProvider';
import { ArrowDown } from '../../icons/ArrowDown';
import { ArrowUp } from '../../icons/ArrowUp';
import { Item, MainContent } from './MainContent';
import { Snackbar } from '../Snackbar/Snackbar';
import theme from '../../theme';
import useDevices from '../../hooks/useDevices/useDevices';

jest.mock('../../hooks/useDevices/useDevices');
jest.mock('../AppStateProvider/AppStateProvider');

const mockUseDevices = useDevices as jest.Mock<any>;
const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;
const mockDispatch = jest.fn();

const mockDevices = {
  audioInputDevices: [],
  videoInputDevices: [],
  audioOutputDevices: [],
};

mockUseDevices.mockImplementation(() => mockDevices);

describe('the MainContent component', () => {
  it('should set the isActive prop on the active pane', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 1, preflightTest: { progress: null } } }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(Item).at(1).prop('isActive')).toBe(true);
    expect(wrapper.find(Item).find({ isActive: true }).length).toBe(1);
  });

  it('should set the correct props on inactive items', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 1, preflightTest: { progress: null } } }));
    const wrapper = shallow(<MainContent />);
    const item = wrapper.find(Item).at(0).dive();
    expect(item.prop('className')).toContain('inactive');
    expect(item.prop('aria-hidden')).toBe(true);
    expect(item.prop('onClick')).toEqual(expect.any(Function));
  });

  it('should set the correct props on active items', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 1, preflightTest: { progress: null } } }));
    const wrapper = shallow(<MainContent />);
    const item = wrapper.find(Item).at(1).dive();
    expect(item.prop('className')).not.toContain('inactive');
    expect(item.prop('aria-hidden')).toBe(false);
    expect(item.prop('onClick')).toBe(undefined);
  });

  it('should set a new pane as the activePane when it is clicked', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 1,
        preflightTest: {
          progress: null,
        },
        bitrateTest: {
          report: null,
        },
      },
      dispatch: mockDispatch,
    }));

    const wrapper = mount(<MainContent />);
    wrapper.find(Item).at(2).simulate('click');

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-active-pane', newActivePane: 2 });
  });

  it('should center the list of Items based on the active pane', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 0,
        preflightTest: {
          progress: null,
        },
        bitrateTest: {
          report: null,
        },
      },
      dispatch: mockDispatch,
    }));
    const { rerender } = render(
      <MuiThemeProvider theme={theme}>
        <MainContent />
      </MuiThemeProvider>
    );

    const div = screen.getAllByTestId('item-container')[1];

    // js-dom doesn't compute heights, so here we must set the properties ourselves
    Object.defineProperties(div, {
      offsetTop: {
        value: 100,
      },
      offsetHeight: {
        value: 119,
      },
    });

    // Sets a new active pane and rerenders
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 1,
        preflightTest: {
          progress: null,
        },
      },
    }));
    rerender(
      <MuiThemeProvider theme={theme}>
        <MainContent />
      </MuiThemeProvider>
    );

    expect(div.parentElement!.style.transform).toEqual(`translateY(calc(50vh - 159.5px + 50px))`); // eslint-disable-line
  });

  it('should disable the Up button when the first pane is active', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 0,
        preflightTest: {
          progress: null,
          tokenError: null,
        },
        downButtonDisabled: false,
      },
    }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(ArrowUp).parent().prop('disabled')).toBe(true);
    expect(wrapper.find(ArrowDown).parent().prop('disabled')).toBe(false);
  });

  it('should disable the Up button when isSnackbarOpen is true', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.CameraTest,
        preflightTest: {
          tokenError: null,
        },
        videoInputTestReport: {
          errors: ['mockErrors'],
        },
      },
    }));

    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(ArrowUp).parent().prop('disabled')).toBe(true);
  });

  it('should disable the Down button when downButtonDisabled is true', () => {
    const numberOfPanes = Object.keys(ActivePane).length / 2;
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: numberOfPanes,
        preflightTest: {
          progress: null,
        },
        downButtonDisabled: true,
      },
    }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(ArrowUp).parent().at(0).prop('disabled')).toBe(false);
    expect(wrapper.find(ArrowDown).parent().prop('disabled')).toBe(true);
  });

  it('should not disable any buttons when the active pane is not the first and when downButtonDisabled is false', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 3,
        preflightTest: {
          progress: null,
        },
        downButtonDisabled: false,
      },
    }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(ArrowUp).parent().prop('disabled')).toBe(false);
    expect(wrapper.find(ArrowDown).parent().prop('disabled')).toBe(false);
  });

  it('should make the previous pane the active pane when the Up button is clicked', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 3,
        preflightTest: {
          progress: null,
        },
        bitrateTest: {
          report: null,
        },
      },
      dispatch: mockDispatch,
    }));
    const wrapper = mount(<MainContent />);
    wrapper.find(ArrowUp).simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'previous-pane' });
  });

  it('should call the nextPane function when the Down button is clicked', () => {
    const mockNextPane = jest.fn();
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: 3,
        preflightTest: {
          progress: null,
        },
        bitrateTest: {
          report: null,
        },
        downButtonDisabled: false,
      },
      nextPane: mockNextPane,
      dispatch: mockDispatch,
    }));
    const wrapper = mount(<MainContent />);

    wrapper.find(ArrowDown).simulate('click');
    expect(mockNextPane).toHaveBeenCalled();
  });

  describe('the hideAll and hideAfter css classes', () => {
    it('should hide all other items when active pane is GetStarted', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.GetStarted,
          preflightTest: {
            progress: null,
          },
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAll');
    });

    it('should hide all other items when active pane is CameraTest and there is a video test error', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.CameraTest,
          preflightTest: {
            tokenError: null,
          },
          videoInputTestReport: {
            errors: ['mockErrors'],
          },
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAll');
    });

    it('should hide all other items when active pane is AudioTest and there is an audio test error', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.AudioTest,
          preflightTest: {
            tokenError: null,
          },
          audioInputTestReport: {
            errors: ['mockErrors'],
          },
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAll');
    });

    it('should hide the following item when active pane is DeviceCheck', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.DeviceCheck,
          preflightTest: {
            progress: null,
          },
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAfter');
    });

    it('should hide the following item when active pane is DeviceError', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.DeviceError,
          preflightTest: {
            progress: null,
          },
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAfter');
    });

    it('should hide the following item when preflight test is running and active pane is Connectivty', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.Connectivity,
          preflightTest: {
            progress: 'mediaAcquired',
          },
          preflightTestInProgress: true,
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAfter');
    });

    it('should hide the following item when preflight test is running and active pane is BrowserTest', () => {
      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.BrowserTest,
          preflightTest: {
            progress: 'mediaAcquired',
          },
          preflightTestInProgress: true,
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAfter');
    });

    it('should hide the following item when browser is unsupported and active pane is BrowserTest', () => {
      // @ts-ignore
      Video.isSupported = false;

      mockUseAppStateContext.mockImplementation(() => ({
        state: {
          activePane: ActivePane.BrowserTest,
          preflightTest: {
            tokenError: null,
          },
          preflightTestInProgress: false,
        },
      }));

      const wrapper = shallow(<MainContent />);

      expect(wrapper.find('div').at(1).prop('className')).toContain('hideAfter');
    });
  });
  it('should open the snackbar when there is a video test error', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.CameraTest,
        preflightTest: {
          tokenError: null,
        },
        videoInputTestReport: {
          errors: ['mockErrors'],
        },
      },
    }));

    const wrapper = shallow(<MainContent />);

    expect(wrapper.find(Snackbar).exists()).toBe(true);
  });

  it('should open the snackbar when there is an audio input test error', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.AudioTest,
        preflightTest: {
          tokenError: null,
        },
        audioInputTestReport: {
          errors: ['mockErrors'],
        },
      },
    }));

    const wrapper = shallow(<MainContent />);

    expect(wrapper.find(Snackbar).exists()).toBe(true);
  });

  it('should open the snackbar when there is an audio output test error that is not "No audio detected"', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.AudioTest,
        preflightTest: {
          tokenError: null,
        },
        audioOutputTestReport: {
          errors: ['mockErrors'],
        },
      },
    }));

    const wrapper = shallow(<MainContent />);

    expect(wrapper.find(Snackbar).exists()).toBe(true);
  });

  it('should not open the snackbar when audio output test error is "No audio detected"', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: {
        activePane: ActivePane.AudioTest,
        preflightTest: {
          tokenError: null,
        },
        audioOutputTestReport: {
          errors: ['No audio detected'],
        },
      },
    }));

    const wrapper = shallow(<MainContent />);

    expect(wrapper.find(Snackbar).exists()).toBe(true);
  });
});
