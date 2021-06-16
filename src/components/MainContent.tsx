import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
import { ActivePane, useAppStateContext } from './AppStateProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'fixed',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    scrollContainer: {
      transition: 'all 1s ease',
      position: 'relative',
      transform: 'translateY(50vh)',
      '& .inactive': {
        opacity: 0.2,
        userSelect: 'none',
      },
    },
    hideAll: {
      '& .inactive': {
        opacity: 0,
        visibility: 'hidden',
      },
    },
    item: {
      transition: 'all 1s ease',
      cursor: 'pointer',
      padding: '3em 0',
    },
  })
);

function Item({ children, isActive, onClick }) {
  const theme = useTheme();
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isActive) {
      const el = ref.current;
      const offset = el.offsetTop + el.offsetHeight * 0.5;
      el.parentElement.style.transform = `translateY(calc(50vh - ${offset}px + ${theme.navHeight / 2}px))`;
    }
  }, [isActive, theme.navHeight]);

  return (
    <div ref={ref} className={clsx(classes.item, { inactive: !isActive })} onClick={onClick} aria-hidden={!isActive}>
      {children}
    </div>
  );
}

const content = [
  { pane: ActivePane.GetStarted, component: <h1>Get Started!</h1> },
  { pane: ActivePane.DeviceSetup, component: <h1>Hello!</h1> },
  { pane: ActivePane.Connectivity, component: <h1>Hello! 2</h1> },
  { pane: ActivePane.Quality, component: <h1>Hello! 3</h1> },
  { pane: ActivePane.Results, component: <h1>Hello! 4</h1> },
];

export function MainContent() {
  const classes = useStyles();
  const { activePane, setActivePane } = useAppStateContext();

  return (
    <div className={classes.container}>
      <div
        className={clsx(classes.scrollContainer, {
          [classes.hideAll]: activePane === 0,
        })}
      >
        {content.map((pane, i) => (
          <Item key={i} isActive={activePane === pane.pane} onClick={() => setActivePane(pane.pane)}>
            {pane.component}
          </Item>
        ))}
      </div>
    </div>
  );
}
