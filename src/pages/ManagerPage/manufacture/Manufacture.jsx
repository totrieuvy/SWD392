import { Button, Input, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

import "./Manufacture.scss";

function Manufacture() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    document.title = "Manufacture";
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("v1/manufacturer");
      const sortedData = response.data.data.sort((a, b) => b.isActive - a.isActive);

      if (Array.isArray(response.data.data)) {
        setDataSource(sortedData);
        setFilteredData(sortedData);
      } else {
        console.error("Expected an array but received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ShortName",
      dataIndex: "shortName",
      key: "shortName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Country Name",
      dataIndex: "countryName",
      key: "countryName",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.isActive - b.isActive,
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "InActive"}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const handleSearch = () => {
    const filtered = dataSource.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <div className="Manufacture">
      <h1>List of manufactures</h1>
      <div className="Staff__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by Manufacture Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div>
          <Button type="primary">Add new manufacture</Button>
        </div>
      </div>
      <Table dataSource={filteredData} columns={columns} rowKey="manufacturerId" />
    </div>
  );
}

export default Manufacture;
