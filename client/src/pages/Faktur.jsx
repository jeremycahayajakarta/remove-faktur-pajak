import React, { useEffect, useState } from "react";
import {
  Alert,
  Input,
  Button,
  Col,
  Row,
  Flex,
  DatePicker,
  Card,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import fakturApi from "../api/fakturApi";
import TableFaktur from "../components/TableFaktur";
import TableLog from "../components/TableLog";
const { RangePicker } = DatePicker;

const Faktur = () => {
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(false);
  const [successfulMessage, setSuccessfulMessage] = useState(null);

  // Button
  const [disabled, setDisabled] = useState(true);

  const [faktur, setFaktur] = useState([]);
  const [log, setLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dates, setDates] = useState([]);

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
    setDisabled(event.target.value.trim() === "");
  };

  const handleSubmitID = async () => {
    try {
      setLoading(true);
      const response = await fakturApi.getFakturById(inputValue);
      setFaktur(response.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFaktur = async (id, year, alasan) => {
    try {
      const response = await fakturApi.removeFaktur(id, year, alasan);
      if (!response.ok) {
        throw new Error("Failed to remove faktur pajak");
      }

      const updatedData = faktur.filter((item) => item.fak__ref !== id);
      setFaktur(updatedData);

      const updatedLog = await fakturApi.getAllLog();
      setLog(updatedLog.data);

      navigate("/faktur");
      setSuccessfulMessage(
        `Faktur pajak ${id} tahun ${year} berhasil diremove`
      );
    } catch (error) {
      console.error("Failed to remove faktur pajak: ", error);
    }
  };

  const onChangeDate = (dates, dateStrings) => {
    setDates(dates);
  };

  const handleSubmitDate = async () => {
    try {
      setLoading(true);
      const start_date = dayjs(dates[0]).format("YYYY-MM-DD");
      const end_date = dayjs(dates[1]).format("YYYY-MM-DD");
      const response = await fakturApi.getFakturByDate(start_date, end_date);
      setFaktur(response.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    } finally {
      setLoading(false);
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
              <Button
                type="primary"
                onClick={handleSubmitID}
                disabled={disabled}
              >
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
              <Button type="primary" onClick={handleSubmitDate}>
                Search
              </Button>
            </Col>
          </Flex>
        </Row>
      </Flex>
      {loading ? (
        <Flex justify="center" gap={"large"} style={{ margin: 20 }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <TableFaktur faktur={faktur} onRemoveFaktur={handleRemoveFaktur} />
      )}

      <Card title="Log">
        <TableLog log={log} />
      </Card>
    </>
  );
};

export default Faktur;
