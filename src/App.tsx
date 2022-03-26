import { createStyles, makeStyles, Theme } from '@material-ui/core';
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
      [theme.breakpoints.between('md', 1280)]: {
        width: `calc(100% - ${theme.tabletBrandSidebarWidth}px)`,
      },
      [theme.largeMobileLandscapeBreakpoint.down('sm')]: {
        width: '100%',
        overflowY: 'auto',
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
      [theme.breakpoints.between('md', 1280)]: {
        left: `calc(100% - ${theme.tabletBrandSidebarWidth}px)`,
      },
      [theme.largeMobileLandscapeBreakpoint.down('sm')]: {
        display: 'none',
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
        <div className={classes.brandSidebar}>
          <Logo />
        </div>
      </div>
    </AppStateProvider>
  );
}

export default App;
