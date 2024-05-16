import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import fakturApi from "../api/fakturApi";
import TableLog from "../components/TableLog";

const Log = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const log = await fakturApi.getAllLog();
        setLog(log.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchLog();
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmitLogID = async () => {
    try {
      const log = await fakturApi.getLogById(inputValue);
      setLog(log.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  const handleSubmitLogDate = async () => {
    try {
      setLoading(true);
      const start_date = dayjs(startDate).format("YYYY-MM-DD");
      const end_date = dayjs(endDate).format("YYYY-MM-DD");
      const log = await fakturApi.getLogByDate(start_date, end_date);
      setLog(log.data);
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
    } else if (log) {
      return <TableLog log={log} />;
    }
    return <div>Select another ID</div>;
  };

  return (
    <Container>
      <h1>Log</h1>
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
          <Button variant="contained" onClick={handleSubmitLogID}>
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
          <Button variant="contained" onClick={handleSubmitLogDate}>
            Submit
          </Button>
        </FormControl>
      </Box>
      {renderContent()}
    </Container>
  );
};

export default Log;
