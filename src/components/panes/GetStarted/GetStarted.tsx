import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { Button, Container, Grid, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import Hello from './Hello.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      justifyContent: 'space-between',
      [theme.breakpoints.between(767, 960)]: {
        marginLeft: '3em',
        justifyContent: 'center',
        width: '70%',
      },
      [theme.breakpoints.between(960, 'lg')]: {
        justifyContent: 'center',
      },
    },
  })
);

export function GetStarted() {
  const { nextPane } = useAppStateContext();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const imageSize = isMobile ? { width: '200px', height: '200px' } : { width: '284px', height: '284px' };

  return (
    <Container>
      <Grid container alignItems="center" className={classes.gridContainer}>
        <Grid item md={5}>
          <Typography variant="h1" gutterBottom>
            Let's get started.
          </Typography>

          <Typography variant="body1" gutterBottom>
            We'll help you solve any video troubles you're experiencing but first, let's check your setup.
          </Typography>

          <Button variant="contained" color="primary" onClick={nextPane} style={{ marginBottom: '1em' }}>
            Get started
          </Button>
        </Grid>

        <Grid item md={5}>
          {/* 
          The size of the image is explicitly stated here so that this content can properly be centered vertically
          before the image is loaded.
          */}
          <img src={Hello} alt="Hello" style={imageSize} />
          <Typography variant="body1" color="textSecondary">
            <strong>Not sure about something?</strong> Skip that section for now, and your support administrator can
            help later.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
