import React, { useState } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import fakturApi from "../api/fakturApi";
import DialogRemove from "./DialogRemove";

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
  // const [items, setItems] = useState(null);
  // const [currentItem, setCurrentItem] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  
  // const navigate = useNavigate();

  // const handleRemoveFaktur = async (id, year) => {
  //   try {
  //     const response = await fakturApi.removeFaktur(id, year);
  //     console.log(response);
  //     if (!response.ok) {
  //       throw new Error("Failed to remove faktur pajak");
  //     }

  //     const updatedData = data.filter((item) => item.fak__ref !== id);
  //     setData(updatedData);
  //     navigate("/faktur", {
  //       state: {
  //         message: `Faktur pajak ${id} tahun ${year} berhasil diremove`,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Failed to remove faktur pajak: ", error);
  //   }
  // };

  // const handleOpenDialog = (item) => {
  //   const rowKey = item.fak__ref
  //   setCurrentItem(rowKey);
  //   setIsOpen(true);
  // };

  // const handleCloseDialog = () => {
  //   setCurrentItem(null);
  //   setIsOpen(false);
  // };

  return (
    <Table
      columns={columns}
      style={{ marginTop: "10px" }}
      dataSource={faktur}
    />
  );
};

export default TableFaktur;
