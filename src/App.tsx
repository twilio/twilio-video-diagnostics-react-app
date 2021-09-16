import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { AppStateProvider } from './components/AppStateProvider/AppStateProvider';
import Header from './components/Header/Header';
import { MainContent } from './components/MainContent/MainContent';
import { Logo } from './icons/Logo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appContainer: {
      position: 'relative',
      width: '100%',
      [theme.breakpoints.down('md')]: {
        width: 'auto',
      },
      height: '100%',
      background: theme.backgroundColor,
      overflow: 'hidden',
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
      </div>
    </AppStateProvider>
  );
}

export default App;
