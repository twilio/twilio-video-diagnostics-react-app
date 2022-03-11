import { SmallError } from '../../icons/SmallError';
import { makeStyles, Typography, Button, Theme, createStyles } from '@material-ui/core';
import MUISnackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '400px',
      minHeight: '50px',
      background: 'white',
      padding: '1em',
      borderRadius: '3px',
      boxShadow: '0 12px 24px 4px rgba(40,42,43,0.2)',
      borderLeft: '4px solid #D61F1F',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: '0.5em',
      },
    },
    contentContainer: {
      display: 'flex',
      lineHeight: 1.8,
    },
    iconContainer: {
      display: 'flex',
      padding: '0 1.3em 0 0.3em',
      transform: 'translateY(3px)',
    },
    headline: {
      fontWeight: 'bold',
    },
  })
);

interface SnackbarProps {
  open: boolean;
}

export function Snackbar({ open }: SnackbarProps) {
  const classes = useStyles();

  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={110000}
    >
      <div className={classes.container}>
        <div className={classes.contentContainer}>
          <div className={classes.iconContainer}>
            <SmallError />
          </div>
          <div>
            <Typography variant="body1" className={classes.headline}>
              Device change: unable to connect -
            </Typography>
            <Typography variant="body1">
              {' '}
              please reset your browser/OS permissions (which may be in your "Settings") and refresh this page.
            </Typography>
            <Button style={{ marginTop: '1em' }} variant="outlined" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    </MUISnackbar>
  );
}
