import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import {
  createStyles,
  makeStyles,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Success from './Success.png';
import { SuccessStatus } from '../../../icons/StatusIcons';
import { useState } from 'react';
import { ViewIcon } from '../../../icons/ViewIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      width: '6000px',
    },
    content: {
      padding: '3em',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: '0.3em',
      },
    },
    viewButton: {
      background: 'white',
      marginTop: '2em',
      '& svg': {
        position: 'relative',
        left: '-5px',
      },
    },
  })
);

export function Connectivity() {
  const classes = useStyles();
  const { nextPane } = useAppStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} classes={{ paper: classes.modal }}>
        <DialogTitle disableTypography>
          <Typography variant="h3">Detailed connection information</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Status</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Connection Type</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <SuccessStatus />
                    <Typography variant="body1">
                      <strong>Up</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Twilio Servers</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <SuccessStatus />
                    <Typography variant="body1">
                      <strong>Reachable</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Signaling Gateway</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <SuccessStatus />
                    <Typography variant="body1">
                      <strong>Reachable</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">TURN Servers</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <Container>
        <Grid container alignItems="center" justify="space-between">
          <Grid item md={5}>
            <Typography variant="h1" gutterBottom>
              Connection Success
            </Typography>

            <Typography variant="body1" gutterBottom>
              All connections to Twilio's servers are working correctly.
            </Typography>

            <Button variant="contained" color="primary" onClick={nextPane}>
              Ok
            </Button>
          </Grid>

          <Grid item md={5}>
            {/* 
          The size of the image is explicitly stated here so that this content can properly be centered vertically
          before the image is loaded.
          */}
            <img src={Success} alt="Success" style={{ width: '245px', height: '200px' }} />
            <Button variant="outlined" onClick={() => setIsModalOpen(true)} className={classes.viewButton}>
              <ViewIcon />
              View detailed connection information
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
