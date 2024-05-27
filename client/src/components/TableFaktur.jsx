import { useState } from "react";
import { Table, Button, Modal, Select } from "antd";

const TableFaktur = (props) => {
  const { faktur, onRemoveFaktur } = props;
  const columns = [
    {
      title: "Site",
      dataIndex: "site",
      key: "site",
    },
    {
      title: "Jurnal ID",
      dataIndex: "jurnal_id",
      key: "jurnal_id",
    },
    {
      title: "Invoice",
      dataIndex: "invoice_id",
      key: "invoice_id",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Periode",
      dataIndex: "periode",
      key: "periode",
    },
    {
      title: "Customer ID",
      dataIndex: "cust_id",
      key: "cust_id",
    },
    {
      title: "Customer Name",
      dataIndex: "cust_name",
      key: "cust_name",
    },
    {
      title: "Faktur Pajak",
      dataIndex: "no_faktur",
      key: "no_faktur",
    },
    {
      title: "User",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => (text ? text : <>No User Data</>),
    },
    {
      title: "Action",
      render: (text, record) => (
        <Button type="primary" danger onClick={() => showModal(record)}>
          Remove
        </Button>
      ),
    },
  ];

  // Alasan
  const [alasan, setAlasan] = useState("Pembetulan");
  const options = [
    { value: "Pembetulan", label: "Pembetulan" },
    { value: "Tidak ditagih", label: "Tidak ditagih" },
    { value: "Revisi", label: "Revisi" },
    { value: "Debit note", label: "Debit note" },
  ];

  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const showModal = (row) => {
    setIsModalVisible(true);
    setSelectedRow(row);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRow(null);
  };

  const handleRemoveFaktur = async () => {
    await onRemoveFaktur(selectedRow.invoice_id, selectedRow.year, alasan);
    setAlasan("Pembetulan");
    closeModal();
  };

  const handleAlasanChange = (value) => {
    setAlasan(value);
  };

  return (
    <>
      <Table
        scroll={{ y: 300 }}
        columns={columns}
        style={{ marginTop: "10px" }}
        dataSource={faktur}
      />
      {selectedRow && (
        <Modal
          centered
          title={`Hapus faktur pajak ${selectedRow.invoice_id} tahun ${selectedRow.year}?`}
          open={isModalVisible}
          onOk={() => handleRemoveFaktur()}
          onCancel={() => closeModal()}
        >
          <p>
            Catatan: setelah Anda menghapus, Anda tidak dapat mengembalikannya!
          </p>
          <Select
            defaultValue={"Pembetulan"}
            options={options}
            onChange={handleAlasanChange}
          />
        </Modal>
      )}
    </>
  );
};

export default TableFaktur;
