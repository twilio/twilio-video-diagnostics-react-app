import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ErrorIcon } from '../../../icons/ErrorIcon';
import Hello from './Hello.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      justifyContent: 'space-between',
    },
    /* 
    The size of the image is explicitly stated here so that this content can properly be centered vertically
    before the image is loaded.
    */
    illustration: {
      width: '284px',
      height: '284px',
      [theme.breakpoints.down('md')]: {
        width: '200px',
        height: '200px',
      },
    },
  })
);

export function GetStarted() {
  const { nextPane, state } = useAppStateContext();
  const classes = useStyles();

  return (
    <Container>
      <Grid container alignItems="center" className={classes.gridContainer}>
        <Grid item lg={5}>
          {state.appIsExpired ? (
            <>
              <Typography variant="h1" gutterBottom>
                <ErrorIcon />
                App has expired.
              </Typography>

              <Typography variant="body1" gutterBottom>
                Please re-deploy the application and try again.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h1" gutterBottom>
                Let's get started.
              </Typography>

              <Typography variant="body1" gutterBottom>
                We'll help you solve any video troubles you're experiencing but first, let's check your setup.
              </Typography>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={nextPane}
            style={{ marginBottom: '1em' }}
            disabled={state.appIsExpired}
          >
            Get started
          </Button>
        </Grid>

        <Grid item lg={5}>
          <img src={Hello} alt="Hello" className={classes.illustration} />
          <Typography variant="body1" color="textSecondary">
            <strong>Not sure about something?</strong> Skip that section for now, and your support administrator can
            help later.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
