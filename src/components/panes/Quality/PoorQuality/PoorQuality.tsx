import { Container, Grid, Typography, Button, Paper, makeStyles } from '@material-ui/core';
import { ErrorIcon } from '../../../../icons/ErrorIcon';
import { QualityScore } from '../Quality';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { ViewIcon } from '../../../../icons/ViewIcon';
import { WarningIcon } from '../../../../icons/WarningIcon';

const useStyles = makeStyles({
  modal: {
    width: '6000px',
  },
  paper: {
    padding: '1.5em',
    borderRadius: '8px',
    '& li': {
      '&:not(:last-child)': {
        marginBottom: '1.5em',
      },
    },
  },
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorIcon: {
    position: 'absolute',
    right: 'calc(100% + 18px)',
  },
  viewButton: {
    marginTop: '2em',
    '& svg': {
      position: 'relative',
      left: '-5px',
    },
  },
});

interface PoorQualityProps {
  quality: QualityScore | undefined;
  openModal: () => void;
}

export function PoorQuality({ quality, openModal }: PoorQualityProps) {
  const { nextPane } = useAppStateContext();
  const classes = useStyles();

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item md={5}>
          <Typography variant="h1" gutterBottom style={{ position: 'relative' }}>
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

        <Grid item md={5} className={classes.paperContainer}>
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
      </Grid>
    </Container>
  );
}
