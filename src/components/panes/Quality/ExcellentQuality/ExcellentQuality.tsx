import { Container, Typography, Grid, Button, makeStyles } from '@material-ui/core';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { QualityScore } from '../Quality';
import Excellent from './Excellent.png';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles({
  modal: {
    width: '6000px',
  },
  illustrationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  viewButton: {
    marginTop: '2em',
    '& svg': {
      position: 'relative',
      left: '-5px',
    },
  },
});

interface ExcellentQualityProps {
  quality: QualityScore;
  openModal: () => void;
}

export function ExcellentQuality({ quality, openModal }: ExcellentQualityProps) {
  const { nextPane } = useAppStateContext();
  const classes = useStyles();

  const qualityScore = quality === QualityScore.Excellent ? 'excellent' : 'good';

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item md={5}>
          <Typography variant="h1" gutterBottom>
            Expected quality is {qualityScore}
          </Typography>

          <Typography variant="body1" gutterBottom>
            This is the last step! Your expected audio and video quality is <strong>{qualityScore}</strong> and overall
            performance looks {qualityScore === 'excellent' ? 'good' : 'ok'}.
          </Typography>

          <Button variant="contained" color="primary" onClick={nextPane}>
            Finish up!
          </Button>
        </Grid>

        <Grid item md={5} className={classes.illustrationContainer}>
          {/* 
      The size of the image is explicitly stated here so that this content can properly be centered vertically
      before the image is loaded.
      */}
          <img src={Excellent} alt="Success" style={{ width: '245px', height: '200px' }} />
          <Button variant="outlined" onClick={openModal} className={classes.viewButton}>
            <ViewIcon />
            View detailed quality information
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
