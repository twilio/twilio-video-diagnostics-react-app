import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { Button, Container, Grid, Typography, Hidden } from '@material-ui/core';
import Hello from './Hello.png';
import HelloMobile from './HelloMobile.png';

export function GetStarted() {
  const { nextPane } = useAppStateContext();

  return (
    <Container>
      <Grid container alignItems="center" justifyContent="space-between">
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
          <Hidden smDown>
            <img src={Hello} alt="Hello" style={{ width: '284px', height: '284px' }} />
          </Hidden>
          <Hidden mdUp>
            <img src={HelloMobile} alt="HelloMobile" style={{ width: '180px', height: '180px' }} />
          </Hidden>
          <Typography variant="body1" color="textSecondary">
            <strong>Not sure about something?</strong> Skip that section for now, and your support administrator can
            help later.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
