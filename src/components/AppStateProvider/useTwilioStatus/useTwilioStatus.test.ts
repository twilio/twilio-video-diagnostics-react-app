import useTwilioStatus from './useTwilioStatus';
import axios from 'axios';
import { renderHook } from '@testing-library/react-hooks';

const mockAxiosData = {
  data: {
    components: [
      { name: 'TEST VOICE COMPONENT', status: 'major_outage' },
      { name: 'PROGRAMMABLE VIDEO', status: 'operational' },
      { name: 'TEST CONSOLE COMPONENT', status: 'operational' },
    ],
  },
};

jest.mock('axios', () => jest.fn(() => Promise.resolve(mockAxiosData)));

const mockAxios = axios as any as jest.Mock<any>;

describe('the useTwilioStatus hook', () => {
  it('should dispatch "set-twilio-status" when there is no error', () => {
    const mockDispatch = jest.fn();
    const { result } = renderHook(() => useTwilioStatus(mockDispatch));
    return result.current.getTwilioStatus()!.then(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-twilio-status', status: 'operational' });
    });
  });

  it('should dispatch "set-twilio-status-error" when there is an error', () => {
    const mockDispatch = jest.fn();
    mockAxios.mockImplementationOnce(() => Promise.reject('mock error'));
    const { result } = renderHook(() => useTwilioStatus(mockDispatch));
    return result.current.getTwilioStatus()!.then(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'set-twilio-status-error', error: 'mock error' });
    });
  });
});
