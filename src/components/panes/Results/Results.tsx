import { makeStyles, Button, Container, Grid, Typography } from '@material-ui/core';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { CheckMark } from '../../../icons/CheckMark';
import { DownloadIcon } from '../../../icons/DownloadIcon';
import { downloadJSONFile } from '../../../utils';
import { getQualityScore } from '../Quality/getQualityScore/getQualityScore';
import { QualityScore } from '../Quality/Quality';
import { SmallError } from '../../../icons/SmallError';
import SomeFailed from './SomeFailed.png';
import TestsPassed from './TestsPassed.png';

const useStyles = makeStyles({
  resultContainer: {
    marginTop: '2em',
    '& Button': {
      backgroundColor: '#FFFFFF',
      border: '0.1em solid #8891AA',
    },
    '&:not(:last-child)': {
      paddingBottom: '2em',
      borderBottom: '0.1em solid #8891AA',
    },
  },
  iconContainer: {
    display: 'flex',
    '& svg': {
      margin: '0.2em 0.8em 0 0',
    },
  },
  downloadButton: {
    marginRight: '1.5em',
    '& svg': {
      position: 'relative',
      left: '-5px',
    },
  },
});

export const getQualityScoreString = (score: QualityScore) => {
  let qualityScore = '';

  switch (score) {
    case QualityScore.Excellent:
      qualityScore = 'excellent';
      break;
    case QualityScore.Good:
      qualityScore = 'good';
      break;
    case QualityScore.Average:
      qualityScore = 'average';
      break;
    case QualityScore.Bad:
      qualityScore = 'bad';
      break;
  }
  return qualityScore;
};

export function Results() {
  const { state, finalTestResults, dispatch } = useAppStateContext();
  const { totalQualityScore } = getQualityScore(state.preflightTest.report, state.bitrateTest.report);
  const classes = useStyles();

  const testsPassed = totalQualityScore === QualityScore.Excellent || totalQualityScore === QualityScore.Good;
  const qualityScore = getQualityScoreString(totalQualityScore);

  return (
    <>
      <>
        <Container>
          <Grid container justifyContent="space-between">
            <Grid item md={5}>
              <Typography variant="h1" gutterBottom>
                {testsPassed ? 'All tests passed!' : 'Some tests failed'}
              </Typography>

              {testsPassed ? (
                <Typography variant="body1" gutterBottom>
                  As far as we can tell, your video should be working. If you're still experiencing issues, download
                  your report results and send to your network administrator.
                </Typography>
              ) : (
                <Typography variant="body1" gutterBottom>
                  <strong>One out of three </strong>
                  tests failed – use this list to solve common video issues and restart the test. If you can’t easily
                  solve the problem(s), download report results and send to your network administrator.
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                className={classes.downloadButton}
                onClick={() => downloadJSONFile(finalTestResults)}
              >
                <DownloadIcon />
                Download report results
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#FFFFFF', border: '0.1em solid #8891AA' }}
                onClick={() => window.location.reload()}
              >
                Restart test
              </Button>
              <img src={testsPassed ? TestsPassed : SomeFailed} alt="Success" style={{ marginTop: '7em' }} />
            </Grid>

            <Grid item md={5}>
              <div className={classes.resultContainer}>
                <div className={classes.iconContainer}>
                  <CheckMark />
                  <Typography variant="h3" gutterBottom>
                    Device &amp; Network Setup
                  </Typography>
                </div>
                <Typography variant="body1" gutterBottom>
                  Audio and video successfully received from your hardware and browser.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'set-active-pane', newActivePane: ActivePane.CameraTest })}
                  style={{ marginRight: '1.5em' }}
                >
                  Review hardware
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'set-active-pane', newActivePane: ActivePane.BrowserTest })}
                >
                  Review browser
                </Button>
              </div>

              <div className={classes.resultContainer}>
                <div className={classes.iconContainer}>
                  <CheckMark />
                  <Typography variant="h3" gutterBottom>
                    Connectivity
                  </Typography>
                </div>
                <Typography variant="body1" gutterBottom>
                  All connections are working successfully.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'set-active-pane', newActivePane: ActivePane.Connectivity })}
                >
                  Review connectivity
                </Button>
              </div>

              <div className={classes.resultContainer}>
                <div className={classes.iconContainer}>
                  {testsPassed ? <CheckMark /> : <SmallError />}
                  <Typography variant="h3" gutterBottom>
                    Quality &amp; Performance
                  </Typography>
                </div>

                {testsPassed ? (
                  <Typography variant="body1" gutterBottom>
                    Awesome! Your expected call quality is <strong>{qualityScore}</strong> and overall performance looks
                    {qualityScore === 'excellent' ? ' good' : ' ok'}.
                  </Typography>
                ) : (
                  <Typography variant="body1" gutterBottom>
                    Your overall score is <strong>{qualityScore}</strong> which means that your connection isn't good
                    enough to run video properly. Try out these tips and rerun the test
                  </Typography>
                )}

                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'set-active-pane', newActivePane: ActivePane.Quality })}
                >
                  Review performance
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </>
    </>
  );
}
