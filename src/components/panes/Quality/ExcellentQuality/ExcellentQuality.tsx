import { Container, Typography, Grid, Button, makeStyles, Theme, createStyles } from '@material-ui/core';
import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { QualityScore } from '../Quality';
import Excellent from './Excellent.png';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      display: 'block',
    },
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    modal: {
      width: '6000px',
    },
    illustrationContainer: {
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
    /* 
      The size of the image is explicitly stated here so that this content can properly be centered vertically
      before the image is loaded.
    */
    illustration: {
      width: '245px',
      height: '200px',
    },
    viewButton: {
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
    finishButton: {
      clear: 'left',
      [theme.breakpoints.down('md')]: {
        clear: 'initial',
        marginBottom: '2em',
      },
    },
  })
);

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
      <div className={classes.mainContainer}>
        <Grid item lg={5} className={classes.header}>
          <Typography variant="h1" gutterBottom>
            Expected quality is {qualityScore}
          </Typography>
        </Grid>

        <Grid item lg={5} className={classes.illustrationContainer}>
          <img src={Excellent} alt="Success" className={classes.illustration} />
          <Button variant="outlined" onClick={openModal} className={classes.viewButton}>
            <ViewIcon />
            View detailed quality information
          </Button>
        </Grid>

        <Grid item lg={5} className={classes.finishButton}>
          <Typography variant="body1" gutterBottom>
            This is the last step! Your expected audio and video quality is <strong>{qualityScore}</strong> and overall
            performance looks {qualityScore === 'excellent' ? 'good' : 'ok'}.
          </Typography>

          <Button variant="contained" color="primary" onClick={nextPane}>
            Finish up!
          </Button>
        </Grid>
      </div>
    </Container>
  );
}
