import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { MuiThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import Header from './Header';
import { useAppStateContext } from '../AppStateProvider/AppStateProvider';

jest.mock('../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the Header component', () => {
  it('should show two active HeaderItems when the activePane is 6', () => {
    mockUseAppStateContext.mockImplementation(() => ({
      state: { activePane: 6 },
    }));
    const wrapper = mount(
      <MuiThemeProvider theme={{ ...theme }}>
        <Header />
      </MuiThemeProvider>
    );

    expect(wrapper.find({ label: 'Device & Software Setup' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Connectivity' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Quality & Performance' }).find('div').at(0).prop('className')).not.toContain(
      'active'
    );
    expect(wrapper.find({ label: 'Get Results' }).find('div').at(0).prop('className')).not.toContain('active');
  });

  it('should show four active HeaderItems when the activePane is 8', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 8 } }));
    const wrapper = mount(
      <MuiThemeProvider theme={{ ...theme }}>
        <Header />
      </MuiThemeProvider>
    );
    expect(wrapper.find({ label: 'Device & Software Setup' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Connectivity' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Quality & Performance' }).find('div').at(0).prop('className')).toContain('active');
    expect(wrapper.find({ label: 'Get Results' }).find('div').at(0).prop('className')).toContain('active');
  });

  it('should display the progress bar at 12.5% when the activePane is 1', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 1 } }));
    const { getByTestId } = render(
      <MuiThemeProvider theme={{ ...theme }}>
        <Header />
      </MuiThemeProvider>
    );
    const progressBar = getByTestId('headerProgressBar');
    expect(progressBar.style.width).toEqual('12.5%');
  });

  it('should display the progress bar at 37.5%% when the activePane is 3', () => {
    mockUseAppStateContext.mockImplementation(() => ({ state: { activePane: 3 } }));
    const { getByTestId } = render(
      <MuiThemeProvider theme={{ ...theme }}>
        <Header />
      </MuiThemeProvider>
    );
    const progressBar = getByTestId('headerProgressBar');
    expect(progressBar.style.width).toEqual('37.5%');
  });
});
