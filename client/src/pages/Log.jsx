import React, { useEffect, useState } from "react";
import { Input, Button, Col, Row, Flex, DatePicker } from "antd";

import dayjs from "dayjs";
import fakturApi from "../api/fakturApi";
import TableLog from "../components/TableLog";
const { RangePicker } = DatePicker;

const Log = () => {
  const [log, setLog] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dates, setDates] = useState([]);
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const log = await fakturApi.getAllLog();
        setLog(log.data);
        console.log(log.data);
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

  const onChangeDate = (dates, dateStrings) => {
    setDates(dates);
  };

  const handleSubmitLogDate = async () => {
    try {
      const start_date = dayjs(dates[0]).format("YYYY-MM-DD");
      const end_date = dayjs(dates[1]).format("YYYY-MM-DD");
      const log = await fakturApi.getLogByDate(start_date, end_date);
      setLog(log.data);
    } catch (error) {
      console.error("Error receiving value: ", error);
    }
  };

  return (
    <>
      <Flex justify="space-between">
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
              <Button type="primary" onClick={handleSubmitLogID}>
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
              <Button type="primary" onClick={handleSubmitLogDate}>
                Search
              </Button>
            </Col>
          </Flex>
        </Row>
      </Flex>
      <TableLog log={log} />
    </>
  );
};

export default Log;
