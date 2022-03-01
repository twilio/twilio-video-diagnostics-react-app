import {
  makeStyles,
  TextField,
  Container,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Theme,
  createStyles,
} from '@material-ui/core';
import { CopyIcon } from '../../../../icons/CopyIcon';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { SupportedList } from './SupportedList';

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
    copyButton: {
      borderLeft: 'solid 1px #E1E3EA',
      maxHeight: '2.5em',
      display: 'flex',
    },
    errorIcon: {
      position: 'absolute',
      right: 'calc(100% + 15px)',
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
        right: '0',
        marginBottom: '0.5em',
      },
    },
    caption: {
      marginTop: '1.3em',
    },
    heading: {
      position: 'relative',
    },
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    urlTextBox: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
    paperContainer: {
      float: 'right',
      marginRight: '1em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
  })
);

export function UnsupportedBrowser() {
  const classes = useStyles();

  const appURL = window.location.href;

  const copyAppLink = () => {
    navigator.clipboard.writeText(appURL);
  };

  return (
    <>
      <Container>
        <div className={classes.mainContainer}>
          <Grid item lg={5} className={classes.header}>
            <Typography variant="h1" gutterBottom className={classes.heading}>
              <div className={classes.errorIcon}>
                <ErrorIcon />
              </div>{' '}
              New browser needed
            </Typography>
            <Typography variant="body1" gutterBottom>
              Oh no, your browser isn't supported! Download and install a new one from the list, copy the url below and
              paste it into your new browser to restart the test.
            </Typography>
          </Grid>
          ​
          <Grid item lg={5} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <SupportedList />
            </Paper>
            <Typography variant="caption" align="center" className={classes.caption}>
              We support the most recent and the two previous versions. Please{' '}
              <Link
                color="inherit"
                underline="always"
                target="_blank"
                rel="noopener"
                href="https://www.twilio.com/docs/video/javascript#supported-browsers"
              >
                visit our docs
              </Link>{' '}
              for more details.
            </Typography>
          </Grid>
          <Grid item lg={5} className={classes.urlTextBox}>
            <TextField
              fullWidth={true}
              id="read-only-app-link"
              defaultValue={appURL}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div className={classes.copyButton}>
                      <IconButton edge="end" onClick={copyAppLink}>
                        <CopyIcon />
                      </IconButton>
                    </div>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
        </div>
      </Container>
    </>
  );
}
