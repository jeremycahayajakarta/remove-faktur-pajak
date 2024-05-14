import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
  Paper,
  Button,
  Container,
} from "@mui/material";
import fakturApi from "../api/fakturApi";

const Faktur = () => {
  const [faktur, setFaktur] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const faktur = await fakturApi.getFakturById(inputValue);
      setFaktur(faktur["data"]);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  useEffect(() => {
    const fetchFaktur = async () => {
      try {
        const faktur = await fakturApi.getAllFaktur();
        setFaktur(faktur["data"]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchFaktur();
  }, []);

  return (
    <div>
      <Container>
        <h1>Check</h1>
        <p>Faktur</p>
        <FormControl sx={{ my: 3 }}>
          <InputLabel htmlFor="my-input">Invoice ID</InputLabel>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            aria-describedby="my-helper-text"
          />
          <FormHelperText id="my-helper-text">
            Masukkan Invoice ID
          </FormHelperText>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
        {faktur ? (
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
        ) : (
          <div>No data</div>
        )}
      </Container>
    </div>
  );
};

export default Faktur;
