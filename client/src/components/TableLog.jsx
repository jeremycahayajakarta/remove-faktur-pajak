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
      key: "petugas",
    },
    {
      title: "Faktur Pajak",
      dataIndex: "no_fps",
      key: "fakturpajak",
    },
    {
      title: "Alasan",
      dataIndex: "alasan",
      key: "alasan",
    },
    {
      title: "Tanggal Remove",
      dataIndex: "tgl_remove",
      key: "tanggalremove",
    },
    {
      title: "Waktu Remove",
      dataIndex: "jam_remove",
      key: "wakturemove",
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
