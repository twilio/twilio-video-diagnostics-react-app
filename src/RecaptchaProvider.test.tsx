import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { RecaptchaProvider, useRecaptchaToken } from './RecaptchaProvider';

const mockExecuteRecaptcha = jest.fn(() => Promise.resolve('mockToken'));

jest.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useGoogleReCaptcha: () => ({ executeRecaptcha: mockExecuteRecaptcha }),
}));

jest.mock('@material-ui/core', () => ({
  makeStyles: () => () => ({}),
}));

describe('RecaptchaProvider', () => {
  beforeEach(() => {
    mockExecuteRecaptcha.mockClear();
  });

  describe('when siteKey is provided', () => {
    const wrapper: React.FC = ({ children }) => (
      <RecaptchaProvider siteKey="test-site-key">{children}</RecaptchaProvider>
    );

    it('should provide a getRecaptchaToken function', () => {
      const { result } = renderHook(() => useRecaptchaToken(), { wrapper });
      expect(result.current).toEqual(expect.any(Function));
    });

    it('should call executeRecaptcha with the given action', async () => {
      const { result } = renderHook(() => useRecaptchaToken(), { wrapper });

      await act(async () => {
        await result.current!('test_action');
      });

      expect(mockExecuteRecaptcha).toHaveBeenCalledWith('test_action');
    });
  });

  describe('when siteKey is not provided', () => {
    const wrapper: React.FC = ({ children }) => <RecaptchaProvider>{children}</RecaptchaProvider>;

    it('should return undefined from useRecaptchaToken', () => {
      const { result } = renderHook(() => useRecaptchaToken(), { wrapper });
      expect(result.current).toBeUndefined();
    });

    it('should render children', () => {
      const { result } = renderHook(() => 'rendered', { wrapper });
      expect(result.current).toBe('rendered');
    });
  });
});
