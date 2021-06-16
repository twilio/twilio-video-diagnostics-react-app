import { ActivePane, useAppStateContext } from '../../AppStateProvider';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import Hello from './Hello.png';

export function GetStarted() {
  const { setActivePane } = useAppStateContext();

  return (
    <Container>
      <Grid container alignItems="center" justify="space-between">
        <Grid item lg={5}>
          <Typography variant="h1" gutterBottom>
            Let's get started.
          </Typography>

          <Typography variant="body1" gutterBottom>
            We'll help you solve any video troubles you're experiencing but first, let's check your setup.
          </Typography>

          <Button variant="contained" color="primary" onClick={() => setActivePane(ActivePane.DeviceSetup)}>
            Get started
          </Button>
        </Grid>

        <Grid item lg={5}>
          {/* 
          The size of the image is explicitly stated here so that this content can properly be centered vertically
          before the image is loaded.
          */}
          <img src={Hello} alt="Hello" style={{ width: '284px', height: '284px' }} />
          <Typography variant="body1" color="textSecondary">
            <strong>Not sure about something?</strong> Skip that section for now, and your support administrator can
            help later.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
