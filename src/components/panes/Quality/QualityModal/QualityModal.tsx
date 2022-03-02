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
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ErrorStatus, SuccessStatus, WarningStatus } from '../../../../icons/StatusIcons';
import { QualityScore } from '../Quality';
import { toolTipContent } from './ToolTipContent';
import { InfoIcon } from '../../../../icons/InfoIcon';

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      width: '100%',
      maxWidth: '600px',
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
      '& div': {
        display: 'flex',
        alignItems: 'center',
      },
      '& svg': {
        marginRight: '0.3em',
      },
    },
  })
);

interface QualityModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  jitter: { average?: string; max?: string; qualityScore: QualityScore };
  latency: { average?: string; max?: string; qualityScore: QualityScore };
  packetLoss: { average?: string; max?: string; qualityScore: QualityScore };
  bitrate: { average?: string; max?: string; min?: string; qualityScore: QualityScore };
}

export function QualityModal({ isModalOpen, setIsModalOpen, latency, jitter, packetLoss, bitrate }: QualityModalProps) {
  const statusIcons = {
    [QualityScore.Excellent]: <SuccessStatus />,
    [QualityScore.Good]: <SuccessStatus />,
    [QualityScore.Suboptimal]: <WarningStatus />,
    [QualityScore.Poor]: <ErrorStatus />,
  };
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
                  <div className={classes.iconContainer}>
                    <Tooltip
                      title={toolTipContent.roundTripTime}
                      interactive
                      leaveDelay={250}
                      leaveTouchDelay={3500}
                      enterTouchDelay={100}
                    >
                      <div>
                        <InfoIcon />
                      </div>
                    </Tooltip>
                    <Typography variant="body1">
                      <strong>RTT (ms) avg/max</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {statusIcons[latency.qualityScore]}
                    <Typography variant="body1">{`${latency.average} / ${latency.max} (${
                      QualityScore[latency.qualityScore]
                    })`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <Tooltip
                      title={toolTipContent.jitter}
                      interactive
                      leaveDelay={250}
                      leaveTouchDelay={3500}
                      enterTouchDelay={100}
                    >
                      <div>
                        <InfoIcon />
                      </div>
                    </Tooltip>
                    <Typography variant="body1">
                      <strong>Jitter (s) avg/max</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {statusIcons[jitter.qualityScore]}
                    <Typography variant="body1">{`${jitter.average} / ${jitter.max} (${
                      QualityScore[jitter.qualityScore]
                    })`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <Tooltip
                      title={toolTipContent.packetLoss}
                      interactive
                      leaveDelay={250}
                      leaveTouchDelay={3500}
                      enterTouchDelay={100}
                    >
                      <div>
                        <InfoIcon />
                      </div>
                    </Tooltip>
                    <Typography variant="body1">
                      <strong>Packet loss avg/max</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {statusIcons[packetLoss.qualityScore]}
                    <Typography variant="body1">{`${packetLoss.average}% / ${packetLoss.max}% (${
                      QualityScore[packetLoss.qualityScore]
                    })`}</Typography>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className={classes.iconContainer}>
                    <Tooltip
                      title={toolTipContent.bitrate}
                      interactive
                      leaveDelay={250}
                      leaveTouchDelay={3500}
                      enterTouchDelay={100}
                    >
                      <div>
                        <InfoIcon />
                      </div>
                    </Tooltip>
                    <Typography variant="body1">
                      <strong>Bitrate (kbps) avg/max</strong>
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.iconContainer}>
                    {statusIcons[bitrate.qualityScore]}
                    <Typography variant="body1">{`${bitrate.average} / ${bitrate.max} (${
                      QualityScore[bitrate.qualityScore]
                    })`}</Typography>
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
