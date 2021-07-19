import { ActivePane, useAppStateContext } from '../AppStateProvider/AppStateProvider';
import { ArrowDown } from '../../icons/ArrowDown';
import { ArrowUp } from '../../icons/ArrowUp';
import { Button, makeStyles, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import { GetStarted } from '../panes/GetStarted/GetStarted';
import { CheckPermissions } from '../panes/DeviceSetup/CheckPermissions/CheckPermissions';
import { PermissionError } from '../panes/DeviceSetup/PermissionError/PermissionError';
import AudioTest from '../panes/AudioTest/AudioTest';

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
  hideAfter: {
    '& .active ~ $item': {
      opacity: 0,
      visibility: 'hidden',
    },
  },
  item: {
    transition: 'all 1s ease',
    padding: '3em 0',
  },
  hideItem: {
    visibility: 'hidden',
    position: 'fixed',
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
  isHidden,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isHidden: boolean;
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
      className={clsx(classes.item, { inactive: !isActive, active: isActive, [classes.hideItem]: isHidden })}
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
  { pane: ActivePane.Connectivity, component: <AudioTest /> },
  { pane: ActivePane.Quality, component: <GetStarted /> },
  { pane: ActivePane.Results, component: <GetStarted /> },
];

export function MainContent() {
  const classes = useStyles();
  const { state, dispatch } = useAppStateContext();

  const devicesPermitted = state.audioGranted && state.videoGranted;

  return (
    <>
      <div className={classes.contentContainer}>
        <div
          className={clsx(classes.scrollContainer, {
            [classes.hideAll]: state.activePane === 0,
            [classes.hideAfter]:
              state.activePane === ActivePane.DeviceCheck || state.activePane === ActivePane.DeviceError,
          })}
        >
          {content.map((pane, i) => {
            return (
              <Item
                key={i}
                isActive={state.activePane === pane.pane}
                onClick={() => dispatch({ type: 'set-active-pane', newActivePane: pane.pane })}
                isHidden={
                  (pane.pane === ActivePane.DeviceError && !state.deviceError) ||
                  (pane.pane === ActivePane.DeviceCheck && devicesPermitted)
                }
              >
                {pane.component}
              </Item>
            );
          })}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="outlined"
          onClick={() => dispatch({ type: 'previous-pane' })}
          disabled={!ActivePane[state.activePane - 1]}
        >
          <ArrowUp />
        </Button>
        <Button
          variant="outlined"
          onClick={() => dispatch({ type: 'next-pane' })}
          disabled={
            !ActivePane[state.activePane + 1] ||
            state.activePane === ActivePane.DeviceCheck ||
            state.activePane === ActivePane.DeviceError
          }
        >
          <ArrowDown />
        </Button>
      </div>
    </>
  );
}
