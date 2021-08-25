import useTwilioStatus from './useTwilioStatus';
import axios from 'axios';
import { renderHook } from '@testing-library/react-hooks';

const mockAxiosData = {
  data: {
    components: [
      { name: 'TEST VOICE COMPONENT', status: 'major_outage' },
      { name: 'Group Rooms', status: 'degraded_performance' },
      { name: 'Peer-to-Peer Rooms', status: 'operational' },
      { name: 'Compositions', status: 'operational' },
      { name: 'Recordings', status: 'operational' },
      { name: 'Network Traversal Service', status: 'operational' },
      { name: 'Go Rooms', status: 'partial_outage' },
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
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'set-twilio-status',
        statusObj: {
          Compositions: 'operational',
          'Go Rooms': 'partial_outage',
          'Group Rooms': 'degraded_performance',
          'Network Traversal Service': 'operational',
          Recordings: 'operational',
          'Peer-to-Peer Rooms': 'operational',
        },
      });
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
