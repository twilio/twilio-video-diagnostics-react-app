import { makeStyles, Button, Container, Grid, Typography, Paper, Theme, createStyles } from '@material-ui/core';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      display: 'block',
    },
    paper: {
      padding: '1.5em',
      borderRadius: '8px',
      width: '337px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    okButton: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
    paperContainer: {
      float: 'right',
      marginRight: '1em',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
  })
);

export function SupportedBrowser() {
  const { dispatch, userAgentInfo } = useAppStateContext();
  const classes = useStyles();

  const browser = userAgentInfo.browser;
  const operatingSystem = userAgentInfo.os;

  return (
    <>
      <Container>
        <div className={classes.mainContainer}>
          <Grid item lg={5} className={classes.header}>
            <Typography variant="h1" gutterBottom>
              Browser supported
            </Typography>
            <Typography variant="body1" gutterBottom>
              Looks like your browser is good to go. We're almost done!
            </Typography>
          </Grid>

          <Grid item lg={5} className={classes.paperContainer}>
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

          <Grid item lg={5} className={classes.okButton}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch({ type: 'next-pane' })}
              style={{ marginRight: '1.5em' }}
            >
              Ok
            </Button>
          </Grid>
        </div>
      </Container>
    </>
  );
}
