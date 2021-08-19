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
import { QualityScore } from '../Quality';

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
  })
);

interface QualityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  jitter: { average: number; max: number; qualityScore: QualityScore };
  latency: { average: number; max: number; qualityScore: QualityScore };
  packetLoss: { average: number; max: number; qualityScore: QualityScore };
  bitrate: { average: number; max: number; min: number; qualityScore: QualityScore };
}

export function QualityModal({ isModalOpen, setIsModalOpen, latency, jitter, packetLoss, bitrate }: QualityModalProps) {
  const classes = useStyles();

  return (
    <>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} classes={{ paper: classes.modal }}>
        <DialogTitle disableTypography>
          <Typography variant="h3">Detailed quality information</Typography>
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
                    <strong>Network Info</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Score</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Latency (ms) avg/max</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {latency.qualityScore === QualityScore.Good || latency.qualityScore === QualityScore.Excellent ? (
                      <SuccessStatus />
                    ) : (
                      <ErrorStatus />
                    )}
                    <Typography variant="body1">{`${latency.average} / ${latency.max}`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Jitter (s) avg/max</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {jitter.qualityScore === QualityScore.Good || jitter.qualityScore === QualityScore.Excellent ? (
                      <SuccessStatus />
                    ) : (
                      <ErrorStatus />
                    )}
                    <Typography variant="body1">{`${jitter.average} / ${jitter.max}`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Packet loss avg/max</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {packetLoss.qualityScore === QualityScore.Good ||
                    packetLoss.qualityScore === QualityScore.Excellent ? (
                      <SuccessStatus />
                    ) : (
                      <ErrorStatus />
                    )}
                    <Typography variant="body1">{`${packetLoss.average}% / ${packetLoss.max}%`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Bitrate (kbps) max/avg/min</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {bitrate.qualityScore === QualityScore.Good || bitrate.qualityScore === QualityScore.Excellent ? (
                      <SuccessStatus />
                    ) : (
                      <ErrorStatus />
                    )}
                    <Typography variant="body1">{`${bitrate.max} / ${bitrate.average} / ${bitrate.min}`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}
