import { makeStyles, Button, Container, Grid, Typography, Theme, createStyles, Hidden } from '@material-ui/core';
import { ActivePane, useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { CheckMark } from '../../../icons/CheckMark';
import { DownloadIcon } from '../../../icons/DownloadIcon';
import { getQualityScore } from '../Quality/getQualityScore/getQualityScore';
import { QualityScore } from '../Quality/Quality';
import { SmallError } from '../../../icons/SmallError';
import SomeFailed from './SomeFailed.png';
import TestsPassed from './TestsPassed.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      float: 'left',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
        paddingBottom: '1em',
      },
    },
    buttonContainer: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      gap: '1em',
      width: '100%',
    },
    resultsList: {
      float: 'right',
      [theme.breakpoints.down('md')]: {
        float: 'initial',
      },
    },
    resultContainer: {
      marginTop: '1.5em',
      '&:not(:last-child)': {
        paddingBottom: '1.5em',
        borderBottom: '0.1em solid #8891AA',
      },
      [theme.breakpoints.down('md')]: {
        '&:last-child': {
          paddingBottom: '1.5em',
        },
      },
    },
    iconContainer: {
      display: 'flex',
      '& svg': {
        margin: '0.2em 0.8em 0 0',
      },
    },
    downloadButton: {
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
    restartButton: {
      backgroundColor: '#FFFFFF',
      borderColor: '#8891AA',
    },
    illustration: {
      marginTop: '7em',
    },
    hardwareButton: {
      marginRight: '1.5em',
    },
    gutterBottom: {
      marginBottom: '1em',
      [theme.breakpoints.down('md')]: {
        marginBottom: '1.5em',
      },
    },
  })
);

export function Results() {
  const { state, downloadFinalTestResults, dispatch } = useAppStateContext();
  const { totalQualityScore } = getQualityScore(state.preflightTest.report, state.bitrateTest.report);
  const classes = useStyles();

  const testsPassed = totalQualityScore === QualityScore.Excellent || totalQualityScore === QualityScore.Good;
  const qualityScore = QualityScore[totalQualityScore].toLowerCase();

  return (
    <>
      <Container>
        <div>
          <Grid item lg={5} className={classes.header}>
            <Typography variant="h1" gutterBottom>
              {testsPassed ? 'All tests passed!' : 'Some tests failed'}
            </Typography>

            {testsPassed ? (
              <Typography variant="body1" gutterBottom>
                As far as we can tell, your video should be working. If you're still experiencing issues, download your
                report results and send to your network administrator.
              </Typography>
            ) : (
              <Typography variant="body1" gutterBottom>
                <strong>One out of three </strong>
                tests failed – use this list to solve common video issues and restart the test. If you can’t easily
                solve the problem(s), download report results and send to your network administrator.
              </Typography>
            )}

            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.downloadButton}
                onClick={downloadFinalTestResults}
              >
                <DownloadIcon />
                Download report results
              </Button>
              <Button variant="outlined" className={classes.restartButton} onClick={() => window.location.reload()}>
                Restart test
              </Button>
            </div>

            <Hidden mdDown>
              <img
                src={testsPassed ? TestsPassed : SomeFailed}
                alt={testsPassed ? 'Success' : 'Some Failed'}
                className={classes.illustration}
              />
            </Hidden>
          </Grid>

          <Grid item lg={5} className={classes.resultsList}>
            <div className={classes.resultContainer}>
              <div className={classes.iconContainer}>
                <CheckMark />
                <Typography variant="h3" className={classes.gutterBottom}>
                  Device &amp; Network Setup
                </Typography>
              </div>
              <Typography variant="body1" className={classes.gutterBottom}>
                Audio and video successfully received from your hardware and browser.
              </Typography>

              <div className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  onClick={() => dispatch({ type: 'set-active-pane', newActivePane: ActivePane.CameraTest })}
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
            </div>

            <div className={classes.resultContainer}>
              <div className={classes.iconContainer}>
                <CheckMark />
                <Typography variant="h3" className={classes.gutterBottom}>
                  Connectivity
                </Typography>
              </div>
              <Typography variant="body1" className={classes.gutterBottom}>
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
                <Typography variant="h3" className={classes.gutterBottom}>
                  Quality &amp; Performance
                </Typography>
              </div>

              {testsPassed ? (
                <Typography variant="body1" className={classes.gutterBottom}>
                  Awesome! Your expected call quality is <strong>{qualityScore}</strong> and overall performance looks
                  {qualityScore === 'excellent' ? ' good' : ' ok'}.
                </Typography>
              ) : (
                <Typography variant="body1" className={classes.gutterBottom}>
                  Your overall score is <strong>{qualityScore}</strong> which means that your connection isn't good
                  enough to run video properly. Try out these tips and rerun the test.
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
        </div>
      </Container>
    </>
  );
}
