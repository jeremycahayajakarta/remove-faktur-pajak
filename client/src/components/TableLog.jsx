import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";

const TableLog = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">Invoice</TableCell>
            <TableCell align="right">Petugas</TableCell>
            <TableCell align="right">Faktur Pajak</TableCell>
            <TableCell align="right">Alasan</TableCell>
            <TableCell align="right">Tanggal Remove</TableCell>
            <TableCell align="right">Jam Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.log.map((item) => (
            <TableRow
              key={item.no_fps}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{item.no_inv}</TableCell>
              <TableCell align="right">{item.user_id}</TableCell>
              <TableCell align="right">{item.no_fps}</TableCell>
              <TableCell align="right">{item.alasan}</TableCell>
              <TableCell align="right">{item.tgl_remove}</TableCell>
              <TableCell align="right">{item.jam_remove}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableLog;
