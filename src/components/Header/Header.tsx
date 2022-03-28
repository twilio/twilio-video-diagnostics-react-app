import { ChevronRight } from '../../icons/ChevronRight';
import clsx from 'clsx';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppStateContext, ActivePane } from '../AppStateProvider/AppStateProvider';
import { TwilioLogo } from '../../icons/TwilioLogo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: `calc(100% - ${theme.navHeight}px)`,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 100,
      background: 'inherit',
      [theme.breakpoints.down('sm') + ', screen and (orientation: landscape) and (max-width:899.95px)']: {
        display: 'none',
      },
    },
    breadcrumb: {
      '& p': {
        fontWeight: 600,
        color: '#AEB2C1',
        paddingRight: '2em',
      },
      '&:last-child svg': {
        display: 'none',
      },
      [theme.breakpoints.only('md')]: {
        '& p': {
          width: '80%',
          textAlign: 'center',
        },
      },
    },
    active: {
      '& p': {
        color: theme.typography.body1.color,
      },
    },
    progressBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 'calc(100% - 2px)',
      background: '#CACDD8',
    },
    progressBarForeground: {
      background: theme.palette.primary.main,
      width: '0',
      height: '100%',
      transition: 'width 1s ease',
    },
    mobileLogo: {
      display: 'none',
      [theme.breakpoints.down('sm') + ', screen and (orientation: landscape) and (max-width:899.95px)']: {
        display: 'block',
        margin: '2em 0 1.5em 1.5em',
      },
    },
    gridContainer: {
      justifyContent: 'space-between',
      height: '100%',
      flexWrap: 'wrap',
      [theme.breakpoints.only('md')]: {
        flexWrap: 'nowrap',
      },
    },
  })
);

function HeaderItem({ label, pane }: { label: string; pane: ActivePane }) {
  const classes = useStyles();
  const { state } = useAppStateContext();

  return (
    <div className={clsx(classes.breadcrumb, { [classes.active]: state.activePane >= pane })}>
      <Grid container alignItems="center">
        <Typography variant="body1">{label}</Typography>
        <ChevronRight />
      </Grid>
    </div>
  );
}

export default function Header() {
  const classes = useStyles();
  const { state } = useAppStateContext();

  const numberOfPanes = Object.keys(ActivePane).length / 2;

  return (
    <>
      <div className={classes.header}>
        <Container>
          <Grid container alignItems="center" className={classes.gridContainer}>
            <HeaderItem pane={ActivePane.DeviceCheck} label="Device & Software Setup" />
            <HeaderItem pane={ActivePane.Connectivity} label="Connectivity" />
            <HeaderItem pane={ActivePane.Quality} label="Quality & Performance" />
            <HeaderItem pane={ActivePane.Results} label="Get Results" />
          </Grid>
        </Container>

        <div className={classes.progressBar}>
          <div
            data-testid="headerProgressBar"
            className={classes.progressBarForeground}
            style={{ width: `${(state.activePane / (numberOfPanes - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className={classes.mobileLogo}>
        <TwilioLogo />
      </div>
    </>
  );
}
