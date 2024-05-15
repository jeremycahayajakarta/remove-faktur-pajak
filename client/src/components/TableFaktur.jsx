import React, { useCallback, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import fakturApi from "../api/fakturApi";
import DialogRemove from "./DialogRemove";

const TableFaktur = (props) => {
  // const [items, setItems] = useState(null);
  // const [currentItem, setCurrentItem] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleRemoveFaktur = async (id, year) => {
    try {
      const response = await fakturApi.removeFaktur(id, year);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to remove faktur pajak");
      }
      // navigate("/faktur", {
      //   state: { message: "Faktur pajak berhasil diremove" },
      // });
      navigate("/faktur", {
        state: { message: `Faktur pajak ${id} tahun ${year} berhasil diremove` },
      });
    } catch (error) {
      console.error("Failed to remove faktur pajak: ", error);
    }
  };

  // const handleOpenDialog = (item) => {
  //   const rowKey = item.fak__ref
  //   setCurrentItem(rowKey);
  //   setIsOpen(true);
  // };

  // const handleCloseDialog = () => {
  //   setCurrentItem(null);
  //   setIsOpen(false);
  // };

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
              <TableCell align="right" key={item.fak__ref}>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() =>
                    handleRemoveFaktur(item.fak__ref, item.bkj__ref)
                  }
                >
                  Remove
                </Button>
                {/* <Dialog
                  open={isOpen}
                  onClose={handleCloseDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Hapus Faktur Pajak tahun
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Sekali Anda menghapus faktur pajak, Anda tidak dapat
                      mengembalikannya kembali!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCloseDialog} autoFocus color="error">
                      Remove
                    </Button>
                  </DialogActions>
                </Dialog> */}
                {/* <DialogRemove
                  open={dialogOpen}
                  handleClose={closeDialog}
                  id={item.fak__ref}
                  year={item.bkj__ref}
                /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableFaktur;
