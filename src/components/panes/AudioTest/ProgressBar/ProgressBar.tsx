import { useRef, useEffect } from 'react';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    margin: '0 0.2em 0',
    height: '4px',
    '& div': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
    },
  },
  progress: {
    background: '#14B053',
    right: '100%',
  },
  background: {
    right: 0,
    background: alpha('#E1E3EA', 0.2),
  },
});

interface ProgressBarProps {
  duration: number;
  position: number;
  style?: { [key: string]: string };
}

export default function ProgressBar({ duration, position, style }: ProgressBarProps) {
  const classes = useStyles();
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = progressBarRef.current;
    if (el) {
      window.requestAnimationFrame(() => {
        // We set these values asynchronously so that the browser can recognize the change in the 'right' value.
        // Without this, the progress bar would instantly snap to the designated position.
        el.style.transition = `right ${duration}s linear`;
        el.style.right = `${Math.max(0, 100 - position)}%`;
      });
    }
  }, [duration, position]);

  return (
    <div className={classes.container} style={{ ...style }} data-testid="progressBarContainer">
      <div className={classes.progress} ref={progressBarRef} data-testid="progressBar"></div>
      <div className={classes.background}></div>
    </div>
  );
}
