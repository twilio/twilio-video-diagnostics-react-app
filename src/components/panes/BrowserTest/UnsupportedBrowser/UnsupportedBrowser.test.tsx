import { mount, shallow } from 'enzyme';
import { IconButton } from '@material-ui/core';
import { UnsupportedBrowser } from './UnsupportedBrowser';

const mockAppURL = 'https://mockurl.com';

// @ts-ignore
delete window.location;

// @ts-ignore
window.location = {
  href: mockAppURL,
};

const mockWriteText = jest.fn();

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
});

describe('the UnsupportedBrowser component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<UnsupportedBrowser />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should copy the app url when copy button is clicked on', () => {
    const wrapper = mount(<UnsupportedBrowser />);
    const copyButton = wrapper.find(IconButton);

    copyButton.simulate('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockAppURL);
  });
});
