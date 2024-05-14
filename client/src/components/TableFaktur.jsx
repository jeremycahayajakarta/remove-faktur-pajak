import React, { useCallback, useState } from "react";
import {
  Button,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import DialogRemove from "./DialogRemove";

const TableFaktur = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  });
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Site</TableCell>
            <TableCell align="right">Jurnal ID</TableCell>
            <TableCell align="right">Invoice</TableCell>
            <TableCell align="right">Year</TableCell>
            <TableCell align="right">Periode</TableCell>
            <TableCell align="right">Customer ID</TableCell>
            <TableCell align="right">Faktur Pajak</TableCell>
            <TableCell align="right">User</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.faktur.map((item) => (
            <TableRow
              key={item.fak__ref}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.dossier_}
              </TableCell>
              <TableCell align="right">{item.dgbk_ref}</TableCell>
              <TableCell align="right">{item.fak__ref}</TableCell>
              <TableCell align="right">{item.bkj__ref}</TableCell>
              <TableCell align="right">{item.peri_ref}</TableCell>
              <TableCell align="right">{item.kla__ref}</TableCell>
              <TableCell align="right">{item.cde___ap}</TableCell>
              <TableCell align="right">CMIS User</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={openDialog}
                >
                  Remove
                </Button>
                <DialogRemove
                  open={dialogOpen}
                  handleClose={closeDialog}
                  id={item.fak__ref}
                  year={item.bkj__ref}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableFaktur;
