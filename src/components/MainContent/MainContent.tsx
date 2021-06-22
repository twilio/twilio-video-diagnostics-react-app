import { ActivePane, useAppStateContext } from '../AppStateProvider/AppStateProvider';
import { ArrowDown } from '../../icons/ArrowDown';
import { ArrowUp } from '../../icons/ArrowUp';
import { Button, makeStyles, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { GetStarted } from '../panes/GetStarted/GetStarted';
import { CheckPermissions } from '../panes/DeviceSetup/CheckPermissions';
import { PermissionError } from '../panes/DeviceSetup/PermissionError';

import { useEffect, useRef } from 'react';

const useStyles = makeStyles({
  contentContainer: {
    position: 'absolute',
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
      cursor: 'pointer',
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
    padding: '3em 0',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    display: 'flex',
    flexDirection: 'column',
    '& button': {
      minWidth: 0,
      padding: '0.6em 0.9em',
      background: 'white',
      '&:first-child': {
        marginBottom: '1.5em',
      },
      '&[disabled]': {
        visibility: 'hidden',
      },
    },
  },
  brandSidebar: {
    background: '#06033A',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 'calc(100% - 250px)',
  },
});

export function Item({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (isActive) {
      const el = ref.current;
      const offset = el.offsetTop + el.offsetHeight * 0.5;
      el.parentElement!.style.transform = `translateY(calc(50vh - ${offset}px + ${theme.navHeight / 2}px))`;
    }
  }, [isActive, theme.navHeight]);

  return (
    <div
      ref={ref}
      className={clsx(classes.item, { inactive: !isActive })}
      onClick={!isActive ? onClick : undefined}
      aria-hidden={!isActive}
      data-testid={`item-container`}
    >
      {children}
    </div>
  );
}

const content = [
  { pane: ActivePane.GetStarted, component: <GetStarted /> },
  { pane: ActivePane.DeviceCheck, component: <CheckPermissions /> },
  { pane: ActivePane.DeviceError, component: <PermissionError /> },
  { pane: ActivePane.Connectivity, component: <GetStarted /> },
  { pane: ActivePane.Quality, component: <GetStarted /> },
  { pane: ActivePane.Results, component: <GetStarted /> },
];

export function MainContent() {
  const classes = useStyles();
  const { activePane, setActivePane } = useAppStateContext();

  return (
    <>
      <div className={classes.contentContainer}>
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
      <div className={classes.buttonContainer}>
        <Button
          variant="outlined"
          onClick={() => setActivePane((pane: ActivePane) => pane - 1)}
          disabled={!ActivePane[activePane - 1]}
        >
          <ArrowUp />
        </Button>
        <Button
          variant="outlined"
          onClick={() => setActivePane((pane: ActivePane) => pane + 1)}
          disabled={!ActivePane[activePane + 1]}
        >
          <ArrowDown />
        </Button>
      </div>
    </>
  );
}
