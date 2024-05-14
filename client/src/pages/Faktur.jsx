import React, { useEffect, useState } from "react";
import {
  Alert,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Button,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import fakturApi from "../api/fakturApi";
import TableFaktur from "../components/TableFaktur";

const Faktur = () => {
  const location = useLocation();
  const message = location.state?.message;

  const [loading, setLoading] = useState(false);

  const [faktur, setFaktur] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchFaktur = async () => {
      try {
        const faktur = await fakturApi.getAllFaktur();
        setFaktur(faktur["data"]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    // fetchFaktur();
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmitID = async () => {
    try {
      const faktur = await fakturApi.getFakturById(inputValue);
      setFaktur(faktur["data"]);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  const handleSubmitDate = async () => {
    try {
      setLoading(true);
      const start_date = dayjs(startDate).format("YYYY-MM-DD");
      const end_date = dayjs(endDate).format("YYYY-MM-DD");
      const faktur = await fakturApi.getFakturByDate(start_date, end_date);
      setFaktur(faktur["data"]);
    } catch (error) {
      console.error("Error receiving value: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box alignItems={"center"}>
          <CircularProgress size={60} thickness={5} />
        </Box>
      );
    } else if (faktur) {
      return <TableFaktur faktur={faktur} />;
    }
    return <div>Select another ID</div>;
  };

  const renderSuccessfulMessage = () => {
    if (message) {
      <Box sx={{ margin: 6 }}>
        <Alert severity="success">{message}</Alert>
      </Box>;
    }
  };

  return (
    <div>
      <Container>
        <h1>Faktur</h1>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Invoice ID */}
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
            <Button variant="contained" onClick={handleSubmitID}>
              Submit
            </Button>
          </FormControl>

          {/* Date */}
          <FormControl sx={{ my: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                format="DD/MM/YYYY"
                onChange={(date) => {
                  setStartDate(date);
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                format="DD/MM/YYYY"
                onChange={(date) => {
                  setEndDate(date);
                }}
              />
            </LocalizationProvider>
            <Button variant="contained" onClick={handleSubmitDate}>
              Submit
            </Button>
          </FormControl>
        </Box>
        {renderContent()}
      </Container>
    </div>
  );
};

export default Faktur;
