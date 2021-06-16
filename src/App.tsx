import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { AppStateProvider } from './components/AppStateProvider';
import Header from './components/Header';
import { MainContent } from './components/MainContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appContainer: {
      position: 'relative',
      width: `calc(100% - ${theme.brandSidebarWidth}px)`,
      height: '100%',
      background: theme.backgroundColor,
      overflow: 'hidden',
    },
    brandSidebar: {
      background: '#06033A',
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      left: `calc(100% - ${theme.brandSidebarWidth}px)`,
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
        <div className={classes.brandSidebar}></div>
      </div>
    </AppStateProvider>
  );
}

export default App;
