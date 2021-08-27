import { useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import { createStyles, makeStyles, Button, Container, Grid, Typography } from '@material-ui/core';
import Success from './Success.png';
import { ViewIcon } from '../../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
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
  })
);

interface ConnectionSuccessProps {
  openModal: () => void;
}

export function ConnectionSuccess({ openModal }: ConnectionSuccessProps) {
  const classes = useStyles();
  const { nextPane } = useAppStateContext();

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item md={5}>
            <Typography variant="h1" gutterBottom>
              Connection success
            </Typography>

            <Typography variant="body1" gutterBottom>
              All connections to Twilio's servers are working correctly.
            </Typography>

            <Button variant="contained" color="primary" onClick={nextPane}>
              Ok
            </Button>
          </Grid>

          <Grid item md={5} className={classes.illustrationContainer}>
            {/* 
          The size of the image is explicitly stated here so that this content can properly be centered vertically
          before the image is loaded.
          */}
            <img src={Success} alt="Success" style={{ width: '245px', height: '200px' }} />
            <Button variant="outlined" onClick={openModal} className={classes.viewButton}>
              <ViewIcon />
              View detailed connection information
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
