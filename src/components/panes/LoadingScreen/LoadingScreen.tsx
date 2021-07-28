import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import clsx from 'clsx';
import { useEffect } from 'react';
import { makeStyles, Container, Typography, Grid } from '@material-ui/core';
import { Loading } from '../../../icons/Loading';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hide: {
    visibility: 'hidden',
    position: 'fixed',
    transitionDelay: '1s',
    transitionProperty: 'position',
  },
  inactive: {
    opacity: 0,
  },
  textBox: {
    width: '340px',
    height: '48px',
    textAlign: 'center',
  },
});

export function LoadingScreen() {
  const { state, dispatch } = useAppStateContext();
  const classes = useStyles();

  const isHidden = state.preflightTest.report !== null;
  const isInactive = state.activePane !== ActivePane.LoadingScreen;

  useEffect(() => {
    if (isHidden || state.preflightTest.error !== null) {
      dispatch({ type: 'next-pane' });
    }
  }, [isHidden, dispatch, state.preflightTest.error]);

  return (
    <Container
      className={clsx({
        [classes.hide]: isHidden,
        [classes.inactive]: isInactive,
      })}
      aria-hidden={isHidden || isInactive}
    >
      <Grid container className={classes.container}>
        <Typography variant="h1" gutterBottom>
          Hang Tight!
        </Typography>
        <Typography variant="body1" gutterBottom className={classes.textBox}>
          We're just finishing up your personalized results and creating your report.
        </Typography>
        <Loading />
      </Grid>
    </Container>
  );
}
