import { shallow, mount } from 'enzyme';
import { ActivePane, useAppStateContext } from '../AppStateProvider/AppStateProvider';
import { Item, MainContent } from './MainContent';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Button, MuiThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import { ArrowUp } from '../../icons/ArrowUp';
import { ArrowDown } from '../../icons/ArrowDown';

jest.mock('../AppStateProvider/AppStateProvider');

const mockUseAppStateContext = useAppStateContext as jest.Mock<any>;

describe('the MainContent component', () => {
  it('should', () => {
    mockUseAppStateContext.mockImplementation(() => ({ activePane: 1, setActivePane: jest.fn() }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(Item).at(1).prop('isActive')).toBe(true);
    expect(wrapper.find(Item).find({ isActive: true }).length).toBe(1);
  });

  it('should', () => {
    const mockSetActivePane = jest.fn();
    mockUseAppStateContext.mockImplementation(() => ({ activePane: 1, setActivePane: mockSetActivePane }));
    const wrapper = mount(<MainContent />);
    wrapper.find(Item).at(2).simulate('click');
    expect(mockSetActivePane).toHaveBeenCalledWith(2);
  });

  it('should', () => {
    mockUseAppStateContext.mockImplementation(() => ({ activePane: 0 }));
    const { getAllByTestId, rerender } = render(
      <MuiThemeProvider theme={theme}>
        <MainContent />
      </MuiThemeProvider>
    );
    const div = getAllByTestId('item-container')[1];

    Object.defineProperties(div, {
      offsetTop: {
        value: 100,
      },
      offsetHeight: {
        value: 119,
      },
    });
    act(() => {
      mockUseAppStateContext.mockImplementation(() => ({ activePane: 1 }));
      rerender(
        <MuiThemeProvider theme={theme}>
          <MainContent />
        </MuiThemeProvider>
      );
    });
    expect(div.parentElement!.style.transform).toEqual(`translateY(calc(50vh - 159.5px + 50px))`);
  });

  it('should', () => {
    mockUseAppStateContext.mockImplementation(() => ({ activePane: 0 }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(Button).at(0).prop('disabled')).toBe(true);
    expect(wrapper.find(Button).at(1).prop('disabled')).toBe(false);
  });

  it('should', () => {
    const numberOfPanes = Object.keys(ActivePane).length / 2;
    mockUseAppStateContext.mockImplementation(() => ({ activePane: numberOfPanes }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(Button).at(0).prop('disabled')).toBe(false);
    expect(wrapper.find(Button).at(1).prop('disabled')).toBe(true);
  });

  it('should', () => {
    mockUseAppStateContext.mockImplementation(() => ({ activePane: 1 }));
    const wrapper = shallow(<MainContent />);
    expect(wrapper.find(Button).at(0).prop('disabled')).toBe(false);
    expect(wrapper.find(Button).at(1).prop('disabled')).toBe(false);
  });

  it('should', () => {
    const mockSetActivePane = jest.fn();
    mockUseAppStateContext.mockImplementation(() => ({
      activePane: 1,
      setActivePane: (fn: Function) => mockSetActivePane(fn(1)),
    }));
    const wrapper = mount(<MainContent />);
    wrapper.find(ArrowUp).simulate('click');
    expect(mockSetActivePane).toHaveBeenCalledWith(0);
  });

  it('should', () => {
    const mockSetActivePane = jest.fn();
    mockUseAppStateContext.mockImplementation(() => ({
      activePane: 1,
      setActivePane: (fn: Function) => mockSetActivePane(fn(1)),
    }));
    const wrapper = mount(<MainContent />);
    wrapper.find(ArrowDown).simulate('click');
    expect(mockSetActivePane).toHaveBeenCalledWith(2);
  });
});
