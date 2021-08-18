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
} from '@material-ui/core';
import { CopyIcon } from '../../../../icons/CopyIcon';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { SupportedList } from './SupportedList';

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
  copyButton: {
    borderLeft: 'solid 1px #E1E3EA',
    maxHeight: '2.5em',
    display: 'flex',
  },
  errorIcon: {
    position: 'absolute',
    right: 'calc(100% + 18px)',
  },
  caption: {
    marginTop: '1.3em',
  },
});

export function UnsupportedBrowser() {
  const classes = useStyles();

  const appURL = window.location.href;

  const copyAppLink = () => {
    navigator.clipboard.writeText(appURL);
  };

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={5}>
            <Typography variant="h1" gutterBottom style={{ position: 'relative' }}>
              <div className={classes.errorIcon}>
                <ErrorIcon />
              </div>{' '}
              New browser needed
            </Typography>
            <Typography variant="body1" gutterBottom>
              Oh no, your browser isn't supported! Download and install a new one from the list, copy this url and paste
              it into your new browser to restart the test.
            </Typography>
            <TextField
              style={{ width: '100%' }}
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
          ​
          <Grid item md={5} className={classes.paperContainer}>
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
        </Grid>
      </Container>
    </>
  );
}
