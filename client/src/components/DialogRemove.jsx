import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import fakturApi from "../api/fakturApi";

const DialogRemove = (props) => {
  const navigate = useNavigate();
  const open = props.open;
  const handleClose = props.handleClose;
  const handleRemoveFaktur = async () => {
    const response = await fakturApi.removeFaktur(props.id, props.year);
    console.log(response);
    if (response.ok) {
      navigate("/faktur", {
        state: { message: "Faktur pajak berhasil diremove" },
      });
    } else {
      console.error("Failed to remove faktur pajak");
    }
    return;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Hapus Faktur Pajak {props.id} tahun {props.year}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Sekali Anda menghapus faktur pajak, Anda tidak dapat mengembalikannya
          kembali!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleRemoveFaktur} autoFocus color="error">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRemove;
