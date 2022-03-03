import { Container, Grid, Typography, Button, Paper, makeStyles, Theme, createStyles } from '@material-ui/core';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { QualityScore } from '../Quality';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { ViewIcon } from '../../../../icons/ViewIcon';
import { WarningIcon } from '../../../../icons/WarningIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    heading: {
      position: 'relative',
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
    paper: {
      padding: '1.2em',
      maxWidth: '400px',
      borderRadius: '8px',
      '& li': {
        '&:not(:last-child)': {
          marginBottom: '1.5em',
        },
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
        justifyContent: 'center',
        margin: '0 0 2.5em 0',
      },
    },
    viewButton: {
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
    confirmationButtons: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
  })
);

interface PoorQualityProps {
  quality: QualityScore | undefined;
  openModal: () => void;
}

export function PoorQuality({ quality, openModal }: PoorQualityProps) {
  const { nextPane } = useAppStateContext();
  const classes = useStyles();

  return (
    <Container>
      <div>
        <Grid item lg={5} className={classes.header}>
          <Typography variant="h1" gutterBottom className={classes.heading}>
            <div className={classes.errorIcon}>
              {quality === QualityScore.Suboptimal ? <WarningIcon /> : <ErrorIcon />}
            </div>
            Quality {quality === QualityScore.Suboptimal ? 'is okay' : 'issues'}
          </Typography>

          <Typography variant="body1" gutterBottom>
            This the last step! Your expected audio and video quality is{' '}
            <strong>{quality === QualityScore.Suboptimal ? 'suboptimal' : 'degraded'} </strong>
            and overall performance {quality === QualityScore.Suboptimal ? 'could be better' : 'will be poor'}.
          </Typography>
        </Grid>

        <Grid item lg={5} className={classes.paperContainer}>
          <Paper className={classes.paper}>
            <Typography variant="body1">
              <strong>Tips to improve quality and performance:</strong>
            </Typography>

            <ul>
              <li>
                <Typography variant="body1">
                  Close unused tabs and applications on your computer/device when using video.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">Move closer to your router.</Typography>
              </li>
              <li>
                <Typography variant="body1">Turn off or disconnect from VPN.</Typography>
              </li>
              <li>
                <Typography variant="body1">Restart your computer or device.</Typography>
              </li>
            </ul>
          </Paper>

          <Button variant="outlined" onClick={openModal} className={classes.viewButton}>
            <ViewIcon />
            View detailed quality information
          </Button>
        </Grid>

        <Grid item lg={5} className={classes.confirmationButtons}>
          <Typography variant="body1" gutterBottom>
            <strong>Did you try all of the tips to improve quality?</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={nextPane} style={{ marginRight: '1.5em' }}>
            Yes
          </Button>
          <Button color="primary" onClick={nextPane}>
            Skip for now
          </Button>
        </Grid>
      </div>
    </Container>
  );
}
