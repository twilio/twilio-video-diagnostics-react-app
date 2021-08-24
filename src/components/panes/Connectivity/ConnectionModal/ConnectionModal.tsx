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
import { ErrorStatus, SuccessStatus, WarningStatus } from '../../../../icons/StatusIcons';
import { TwilioStatus } from '../../../AppStateProvider/AppStateProvider';

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

export const determineStatus = (status: string) => {
  if (status === 'operational') return { status: 'Up', icon: <SuccessStatus /> };
  if (status === 'major_outage') return { status: 'Major Outage', icon: <ErrorStatus /> };
  if (status === 'partial_outage') return { status: 'Partial Outage', icon: <WarningStatus /> };
  if (status === 'degraded_performance') return { status: 'Degraded', icon: <WarningStatus /> };
};

export function TwilioStatusRow({ status, serviceName }: { status: string; serviceName: string }) {
  const classes = useStyles();
  const serviceStatus = determineStatus(status);

  return (
    <TableRow>
      <TableCell>
        <div className={classes.iconContainer}>
          {serviceStatus?.icon}
          <Typography variant="body1">
            <strong>{serviceStatus?.status}</strong>
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{serviceName}</Typography>
      </TableCell>
    </TableRow>
  );
}

interface ConnectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  serviceStatuses: TwilioStatus | null;
  signalingGateway: string;
  turnServers: string;
}

export function ConnectionModal({
  isModalOpen,
  setIsModalOpen,
  serviceStatuses,
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
                    <strong>Type</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TwilioStatusRow status={serviceStatuses?.compositions!} serviceName="Compositions" />
              <TwilioStatusRow status={serviceStatuses?.goRooms!} serviceName="Go Rooms" />
              <TwilioStatusRow status={serviceStatuses?.groupRooms!} serviceName="Group Rooms" />
              <TwilioStatusRow status={serviceStatuses?.networkTraversal!} serviceName="Network Traversal" />
              <TwilioStatusRow status={serviceStatuses?.peerToPeerRooms!} serviceName="Peer-to-peer Rooms" />
              <TwilioStatusRow status={serviceStatuses?.recordings!} serviceName="Recordings" />
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
