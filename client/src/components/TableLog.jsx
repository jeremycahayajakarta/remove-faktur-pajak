import React from "react";
import { Table } from "antd";

const TableLog = (props) => {
  const columns = [
    {
      title: "No Invoice",
      dataIndex: "no_inv",
      key: "no_inv",
    },
    {
      title: "Petugas",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Faktur Pajak",
      dataIndex: "no_fps",
      key: "no_fps",
    },
    {
      title: "Alasan",
      dataIndex: "alasan",
      key: "alasan",
    },
    {
      title: "Tanggal Remove",
      dataIndex: "tgl_remove",
      key: "tgl_remove",
    },
    {
      title: "Waktu Remove",
      dataIndex: "jam_remove",
      key: "jam_remove",
    },
  ];
  return (
    <Table
      scroll={{ y: 200 }}
      columns={columns}
      style={{ marginTop: "10px" }}
      dataSource={props.log}
    />
  );
};

export default TableLog;
