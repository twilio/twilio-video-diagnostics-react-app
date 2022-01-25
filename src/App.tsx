import { createStyles, makeStyles, Theme, Hidden } from '@material-ui/core';
import React from 'react';
import { AppStateProvider } from './components/AppStateProvider/AppStateProvider';
import Header from './components/Header/Header';
import { MainContent } from './components/MainContent/MainContent';
import { Logo } from './icons/Logo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appContainer: {
      position: 'relative',
      width: `calc(100% - ${theme.brandSidebarWidth}px)`,
      height: '100%',
      background: theme.backgroundColor,
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        overflowY: 'auto',
      },
      [theme.breakpoints.between('md', 'lg')]: {
        width: `calc(100% - 160px)`,
      },
    },
    brandSidebar: {
      background: '#06033A',
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      left: `calc(100% - ${theme.brandSidebarWidth}px)`,
      '& svg': {
        position: 'absolute',
        right: 0,
        bottom: 40,
      },
      [theme.breakpoints.between('md', 'lg')]: {
        left: `calc(100% - 160px)`,
      },
    },
  })
);

function App() {
  const classes = useStyles();

  return (
    <AppStateProvider>
      <div className={classes.appContainer}>
        <Header />
        <MainContent />
        <Hidden smDown>
          <div className={classes.brandSidebar}>
            <Logo />
          </div>
        </Hidden>
      </div>
    </AppStateProvider>
  );
}

export default App;
