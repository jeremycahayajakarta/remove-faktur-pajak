import React, { useEffect, useState } from "react";
import { Alert, Input, Button, Col, Row, Flex, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import fakturApi from "../api/fakturApi";
import TableFaktur from "../components/TableFaktur";
const { RangePicker } = DatePicker;

const Faktur = () => {
  const [openAlert, setOpenAlert] = useState(true);

  const navigate = useNavigate();
  const [successfulMessage, setSuccessfulMessage] = useState(null);

  const [faktur, setFaktur] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchFaktur = async () => {
      try {
        const faktur = await fakturApi.getAllFaktur();
        setFaktur(faktur.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchFaktur();
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmitID = async () => {
    try {
      const faktur = await fakturApi.getFakturById(inputValue);
      setFaktur(faktur.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  const handleRemoveFaktur = async (id, year) => {
    try {
      const response = await fakturApi.removeFaktur(id, year);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to remove faktur pajak");
      }

      const updatedData = faktur.filter((item) => item.fak__ref !== id);
      setFaktur(updatedData);
      setSuccessfulMessage(
        `Faktur pajak ${id} tahun ${year} berhasil diremove`
      );
      navigate("/faktur");
    } catch (error) {
      console.error("Failed to remove faktur pajak: ", error);
    }
  };

  const onChangeDate = (dates, dateStrings) => {
    setDates(dates);
  };

  const handleSubmitDate = async () => {
    try {
      const start_date = dayjs(dates[0]).format("YYYY-MM-DD");
      const end_date = dayjs(dates[1]).format("YYYY-MM-DD");
      const faktur = await fakturApi.getFakturByDate(start_date, end_date);
      setFaktur(faktur.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  return (
    <>
      {/* TODO: If the alert is closed and page isn't refreshed, the alert will not be shown again */}
      {successfulMessage && (
        <Alert message={successfulMessage} type="success" showIcon closable />
      )}
      <Flex justify="space-between" style={{ marginTop: "16px" }}>
        <Row>
          <Flex gap={10}>
            <Col span={18}>
              <Input
                placeholder="No Invoice"
                onChange={handleInputChange}
                value={inputValue}
              />
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={handleSubmitID}>
                Search
              </Button>
            </Col>
          </Flex>
        </Row>
        <Row>
          <Flex gap={10}>
            <Col span={18}>
              <RangePicker
                placeholder={["Dari tanggal", "Sampai tanggal"]}
                onChange={onChangeDate}
              />
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                onClick={handleSubmitDate}
              >
                Search
              </Button>
            </Col>
          </Flex>
        </Row>
      </Flex>
      <TableFaktur faktur={faktur} onRemoveFaktur={handleRemoveFaktur} />
    </>
  );
};

export default Faktur;
