import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppStateContext, ActivePane } from './AppStateProvider';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 'calc(100% - 100px)',
      background: '#E5E5E5',
      borderBottom: '2px solid #CACDD8',
      display: 'flex',
      justifyContent: 'center',
    },
    innerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '750px',
    },
    active: {
      '& p': {
        fontWeight: 'bold',
      },
    },
    breadcrumb: {
      cursor: 'pointer',
    },
  })
);

export default function Header() {
  const classes = useStyles();
  const { activePane, setActivePane } = useAppStateContext();

  return (
    <div className={classes.header}>
      <div className={classes.innerContainer}>
        <div
          className={clsx(classes.breadcrumb, { [classes.active]: activePane >= ActivePane.DeviceSetup })}
          onClick={() => setActivePane(ActivePane.DeviceSetup)}
        >
          <Typography>Device & Network Setup</Typography>
        </div>
        <div
          className={clsx(classes.breadcrumb, { [classes.active]: activePane >= ActivePane.Connectivity })}
          onClick={() => setActivePane(ActivePane.Connectivity)}
        >
          <Typography>Connectivity</Typography>
        </div>
        <div
          className={clsx(classes.breadcrumb, { [classes.active]: activePane >= ActivePane.Quality })}
          onClick={() => setActivePane(ActivePane.Quality)}
        >
          <Typography>Quality & Performance</Typography>
        </div>
        <div
          className={clsx(classes.breadcrumb, { [classes.active]: activePane >= ActivePane.Results })}
          onClick={() => setActivePane(ActivePane.Results)}
        >
          <Typography>Results</Typography>
        </div>
      </div>
    </div>
  );
}
