import React from "react";
import { Table, Button } from "antd";

const TableFaktur = (props) => {
  const { faktur, onRemoveFaktur } = props;
  const columns = [
    {
      title: "Site",
      dataIndex: "dossier_",
      key: "dossier_",
    },
    {
      title: "Jurnal ID",
      dataIndex: "dgbk_ref",
      key: "dgbk_ref",
    },
    {
      title: "Invoice",
      dataIndex: "fak__ref",
      key: "fak__ref",
    },
    {
      title: "Year",
      dataIndex: "bkj__ref",
      key: "bkj__ref",
    },
    {
      title: "Periode",
      dataIndex: "peri_ref",
      key: "peri_ref",
    },
    {
      title: "Customer ID",
      dataIndex: "kla__ref",
      key: "kla__ref",
    },
    {
      title: "Faktur Pajak",
      dataIndex: "cde___ap",
      key: "cde___ap",
    },
    {
      title: "User",
      dataIndex: "kla__ref",
      key: "kla__ref",
    },
    {
      title: "Action",
      dataIndex: "jam_remove",
      key: "wakturemove",
      render: (text, record) => (
        <Button
          type="primary"
          danger
          onClick={() => onRemoveFaktur(record.fak__ref, record.bkj__ref)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Table
      scroll={{ y: 300 }}
      columns={columns}
      style={{ marginTop: "10px" }}
      dataSource={faktur}
    />
  );
};

export default TableFaktur;
