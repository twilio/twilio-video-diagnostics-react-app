import ProgressBar from './ProgressBar';
import { render } from '@testing-library/react';

describe('the ProgressBar component', () => {
  it('should update the style object asynchronously', (done) => {
    const { getByTestId } = render(<ProgressBar duration={10} position={50} style={{ margin: '0px' }} />);

    const progressBarEl = getByTestId('progressBar') as HTMLDivElement;
    expect(progressBarEl.style.transition).toBe('');
    expect(progressBarEl.style.right).toBe('');
    expect(progressBarEl.parentElement!.style.margin).toBe('0px');

    window.requestAnimationFrame(() => {
      expect(progressBarEl.style.transition).toBe('right 10s linear');
      expect(progressBarEl.style.right).toBe('50%');
      expect(progressBarEl.parentElement!.style.margin).toBe('0px');
      done();
    });
  });

  it('should prevent "style.right" from going below 0%', (done) => {
    const { getByTestId } = render(<ProgressBar duration={10} position={150} style={{ margin: '0px' }} />);

    const progressBarEl = getByTestId('progressBar') as HTMLDivElement;
    expect(progressBarEl.style.right).toBe('');

    window.requestAnimationFrame(() => {
      expect(progressBarEl.style.right).toBe('0%');
      done();
    });
  });
});
