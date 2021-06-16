import { ActivePane, useAppStateContext } from '../../AppStateProvider';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import Hello from './Hello.png';

export function GetStarted() {
  const { setActivePane } = useAppStateContext();

  return (
    <Container>
      <Grid container justify="space-between">
        <Grid item lg={5}>
          <Typography variant="h1" gutterBottom>
            Let's get started.
          </Typography>
          <Typography variant="body1" gutterBottom>
            We'll help you solve any video troubles you're experiencing but first, let's check your setup.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log(setActivePane);
              console.log(ActivePane.Connectivity);
              setActivePane(ActivePane.Connectivity);
            }}
          >
            Get started
          </Button>
        </Grid>
        <Grid item lg={5}>
          <img src={Hello} alt="Hello" />
        </Grid>
      </Grid>
    </Container>
  );
}
