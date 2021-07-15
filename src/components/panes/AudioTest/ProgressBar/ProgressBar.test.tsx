import React from 'react';
import ProgressBar from './ProgressBar';
import { render } from '@testing-library/react';

describe('the ProgressBar component', () => {
  it('should update the style object asynchronously', (done) => {
    const { container } = render(<ProgressBar duration={10} position={50} style={{ margin: '0px' }} />);
    const progressBarEl = container.querySelector('.makeStyles-progress-2') as HTMLDivElement;
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
});
