import { makeStyles, Typography, Table, TableHead, TableBody, TableRow, TableCell, Link } from '@material-ui/core';

const useStyles = makeStyles({
  tableHead: {
    background: '#F4F4F6',
  },
  table: {
    '& td': {
      padding: '0.9em',
    },
  },
});

export function SupportedList() {
  const classes = useStyles();

  return (
    <>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                <strong>Supported browsers</strong>
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                <Link
                  color="inherit"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                  href="https://www.google.com/chrome/"
                >
                  Chrome
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                <Link
                  color="inherit"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                  href="https://www.mozilla.org/en-US/firefox/new/"
                >
                  Firefox
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                <Link
                  color="inherit"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                  href="https://support.apple.com/downloads/safari"
                >
                  Safari
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ borderBottom: 'none' }}>
              <Typography variant="body1">
                <Link
                  color="inherit"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                  href="https://www.microsoft.com/en-us/edge"
                >
                  Edge
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
