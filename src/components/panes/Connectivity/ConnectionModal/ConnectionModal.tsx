import {
  createStyles,
  makeStyles,
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
import { ErrorStatus, SuccessStatus } from '../../../../icons/StatusIcons';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      width: '100%',
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
  })
);

interface ConnectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  serviceStatus: string;
  signalingGateway: string;
  turnServers: string;
}

export function ConnectionModal({
  isModalOpen,
  setIsModalOpen,
  serviceStatus,
  signalingGateway,
  turnServers,
}: ConnectionModalProps) {
  const classes = useStyles();

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
                    {serviceStatus === 'Up' ? <SuccessStatus /> : <ErrorStatus />}
                    <Typography variant="body1">
                      <strong>{serviceStatus}</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Twilio Services</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {signalingGateway === 'Reachable' ? <SuccessStatus /> : <ErrorStatus />}
                    <Typography variant="body1">
                      <strong>{signalingGateway}</strong>
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
                    {turnServers === 'Reachable' ? <SuccessStatus /> : <ErrorStatus />}
                    <Typography variant="body1">
                      <strong>{turnServers}</strong>
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
    </>
  );
}
