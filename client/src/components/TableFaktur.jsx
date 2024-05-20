import { useState } from "react";
import { Table, Button, Modal, Select } from "antd";

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
    await onRemoveFaktur(selectedRow.fak__ref, selectedRow.bkj__ref, alasan);
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
          title={`Hapus faktur pajak ${selectedRow.fak__ref} tahun ${selectedRow.bkj__ref}?`}
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
