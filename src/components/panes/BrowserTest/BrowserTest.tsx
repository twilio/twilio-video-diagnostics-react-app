import { SupportedBrowser } from './SupportedBrowser/SupportedBrowser';
import { UnsupportedBrowser } from './UnsupportedBrowser/UnsupportedBrowser';
import Video from 'twilio-video';

export function BrowserTest() {
  return <>{Video.isSupported ? <SupportedBrowser /> : <UnsupportedBrowser />}</>;
}
