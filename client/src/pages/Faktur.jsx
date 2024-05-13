import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
  Paper,
} from "@mui/material";
import fakturApi from "../api/fakturApi";

const Faktur = () => {
  const [faktur, setFaktur] = useState([]);

  useEffect(() => {
    const fetchFaktur = async () => {
      try {
        const faktur = await fakturApi.getAllFaktur();
        setFaktur(faktur["data"]);
        // console.log(faktur.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchFaktur();
  }, []);

  return (
    <div>
      <h1>Check</h1>
      <p>Faktur</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {faktur.map((item) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Faktur;
