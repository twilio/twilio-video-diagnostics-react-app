import { ChevronRight } from '../../icons/ChevronRight';
import clsx from 'clsx';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppStateContext, ActivePane } from '../AppStateProvider/AppStateProvider';

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
    <div className={classes.header}>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between" style={{ height: '100%' }}>
          <HeaderItem pane={ActivePane.DeviceCheck} label="Device & Network Setup" />
          <HeaderItem pane={ActivePane.LoadingScreen} label="Connectivity" />
          <HeaderItem pane={ActivePane.Quality} label="Quality & Performance" />
          <HeaderItem pane={ActivePane.Results} label="Get Results" />
        </Grid>
      </Container>

      <div className={classes.progressBar}>
        <div
          className={classes.progressBarForeground}
          style={{ width: `${(state.activePane / (numberOfPanes - 3)) * 100}%` }}
        />
      </div>
    </div>
  );
}
