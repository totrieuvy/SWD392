import { Table, Tag, Input, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./Vaccine.scss";
import { formatVND } from "../../../utils/currencyFormat";

function Vaccine() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Vaccine";
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("v1/vaccine");
      const sortedData = response.data.data.sort((a, b) => b.isActive - a.isActive);
      setDataSource(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = dataSource.filter((item) => item.vaccineName.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  };

  // Cột bảng
  const columns = [
    {
      title: "Vaccine Name",
      dataIndex: "vaccineName",
      key: "vaccineName",
      sorter: (a, b) => a.vaccineName.localeCompare(b.vaccineName),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => formatVND(price),
    },
    {
      title: "Min Age",
      dataIndex: "minAge",
      key: "minAge",
      sorter: (a, b) => a.minAge - b.minAge,
    },
    {
      title: "Max Age",
      dataIndex: "maxAge",
      key: "maxAge",
      sorter: (a, b) => a.maxAge - b.maxAge,
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
      sorter: (a, b) => a.manufacturerName.localeCompare(b.manufacturerName),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      defaultSortOrder: "descend", // Mặc định sort giảm dần (Active trước)
      sorter: (a, b) => a.isActive - b.isActive,
      render: (isActive) => (isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
    },
  ];

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <div className="Vaccine">
      <h1>List of vaccines</h1>

      <div className="Vaccine__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by Vaccine Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div>
          <Button type="primary" onClick={handleOpenModal}>
            Add new vaccine
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" scroll={{ x: "max-content", y: 400 }} />
      <Modal
        open={open}
        title="Add new vaccine"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary">
            Add
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default Vaccine;
