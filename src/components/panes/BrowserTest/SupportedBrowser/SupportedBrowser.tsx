import { makeStyles, Button, Container, Grid, Typography, Paper } from '@material-ui/core';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles({
  paper: {
    padding: '1.5em',
    borderRadius: '8px',
    width: '388px',
  },
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export function SupportedBrowser() {
  const { dispatch, userAgentInfo } = useAppStateContext();
  const classes = useStyles();

  const browser = userAgentInfo.browser;
  const operatingSystem = userAgentInfo.os;

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={5}>
            <Typography variant="h1" gutterBottom>
              Browser supported
            </Typography>
            <Typography variant="body1" gutterBottom>
              Looks like your browser is good to go. We're almost done!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch({ type: 'next-pane' })}
              style={{ marginRight: '1.5em' }}
            >
              Ok
            </Button>
          </Grid>

          <Grid item md={5} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="body1">
                <strong>Browser: </strong>
                {browser.name} {browser.version}
              </Typography>
              ​
              <Typography variant="body1">
                <strong>Operating System: </strong>
                {operatingSystem.name} {operatingSystem.version}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
