import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Button, makeStyles, useTheme, Theme, useMediaQuery } from '@material-ui/core';
import Video from 'twilio-video';

import { ActivePane, useAppStateContext } from '../AppStateProvider/AppStateProvider';
import { ArrowDown } from '../../icons/ArrowDown';
import { ArrowUp } from '../../icons/ArrowUp';
import { AudioTest } from '../panes/AudioTest/AudioTest';
import { BrowserTest } from '../panes/BrowserTest/BrowserTest';
import { CameraTest } from '../panes/CameraTest/CameraTest';
import { CheckPermissions } from '../panes/DeviceSetup/CheckPermissions/CheckPermissions';
import { Connectivity } from '../panes/Connectivity/Connectivity';
import { GetStarted } from '../panes/GetStarted/GetStarted';
import { PermissionError } from '../panes/DeviceSetup/PermissionError/PermissionError';
import { Quality } from '../panes/Quality/Quality';
import { Results } from '../panes/Results/Results';
import { Snackbar } from '../Snackbar/Snackbar';

const useStyles = makeStyles((theme: Theme) => ({
  contentContainer: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'initial',
    },
  },
  scrollContainer: {
    transition: 'all 1s ease',
    position: 'relative',
    transform: 'translateY(50vh)',
    '& .inactive': {
      opacity: 0.2,
      userSelect: 'none',
      cursor: 'pointer',
      '& > *': {
        pointerEvents: 'none',
      },
    },
    [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
      transition: 'all 0s ease',
      transform: 'initial',
      '& .inactive': { display: 'none' },
    },
  },
  hideAll: {
    '& .inactive': {
      opacity: 0,
      visibility: 'hidden',
      [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
        '& .inactive': {
          display: 'none',
        },
      },
    },
  },
  hideAfter: {
    '& .active ~ $item': {
      opacity: 0,
      visibility: 'hidden',
    },
    [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
      '& .active ~ $item': {
        display: 'none',
      },
    },
  },
  item: {
    transition: 'all 0.75s ease',
    padding: '3em 0',
    [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
      transition: 'initial',
      padding: '0px',
    },
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
    [theme.breakpoints.down('sm') + theme.includeLandscapeMd]: {
      display: 'none',
    },
  },
}));

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm') + theme.includeLandscapeMd);

  useEffect(() => {
    if (isActive) {
      const el = ref.current;
      const offset = el.offsetTop + el.offsetHeight * 0.5;
      el.parentElement!.style.transform = isMobile
        ? `none`
        : `translateY(calc(50vh - ${offset}px + ${theme.navHeight / 2}px))`;
    }
  });

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
  { pane: ActivePane.CameraTest, component: <CameraTest /> },
  { pane: ActivePane.AudioTest, component: <AudioTest /> },
  { pane: ActivePane.BrowserTest, component: <BrowserTest /> },
  { pane: ActivePane.Connectivity, component: <Connectivity /> },
  { pane: ActivePane.Quality, component: <Quality /> },
  { pane: ActivePane.Results, component: <Results /> },
];

export function MainContent() {
  const classes = useStyles();
  const { state, dispatch, nextPane } = useAppStateContext();

  const devicesPermitted = state.audioGranted && state.videoGranted;
  const testsInProgress = state.preflightTestInProgress || state.bitrateTestInProgress;
  const onLoadingScreen = state.activePane === ActivePane.Connectivity && testsInProgress;
  const preflightErrors = state.preflightTest.tokenError !== null || state.preflightTest.error !== null;

  const deviceTestErrors =
    !!state.audioInputTestReport?.errors.length ||
    !!state.audioOutputTestReport?.errors.length ||
    !!state.videoInputTestReport?.errors.length;
  const isSnackbarOpen =
    deviceTestErrors && (state.activePane === ActivePane.CameraTest || state.activePane === ActivePane.AudioTest);

  return (
    <>
      <Snackbar open={isSnackbarOpen} />
      <div className={classes.contentContainer}>
        <div
          className={clsx(classes.scrollContainer, {
            [classes.hideAll]: state.activePane === 0 || isSnackbarOpen,
            [classes.hideAfter]:
              state.activePane === ActivePane.DeviceCheck ||
              state.activePane === ActivePane.DeviceError ||
              onLoadingScreen ||
              (state.activePane === ActivePane.Connectivity && preflightErrors) ||
              (state.activePane === ActivePane.BrowserTest && (testsInProgress || !Video.isSupported)),
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
          disabled={!ActivePane[state.activePane - 1] || isSnackbarOpen}
        >
          <ArrowUp />
        </Button>
        <Button variant="outlined" onClick={nextPane} disabled={state.downButtonDisabled}>
          <ArrowDown />
        </Button>
      </div>
    </>
  );
}
