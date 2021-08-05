import { shallow } from 'enzyme';
import { BrowserTest } from './BrowserTest';
import { SupportedBrowser } from './SupportedBrowser/SupportedBrowser';
import { UnsupportedBrowser } from './UnsupportedBrowser/UnsupportedBrowser';
import Video from 'twilio-video';

jest.mock('twilio-video', () => ({ version: '1.2' }));

describe('the BrowserTest component', () => {
  it('should render the SupportedBrowser component if browser is supported', () => {
    // @ts-ignore
    Video.isSupported = true;
    const wrapper = shallow(<BrowserTest />);

    expect(wrapper.find(SupportedBrowser).exists()).toBe(true);
  });

  it('should render the UnsupportedBrowser component if browser is supported', () => {
    // @ts-ignore
    Video.isSupported = false;
    const wrapper = shallow(<BrowserTest />);

    expect(wrapper.find(UnsupportedBrowser).exists()).toBe(true);
  });
});
