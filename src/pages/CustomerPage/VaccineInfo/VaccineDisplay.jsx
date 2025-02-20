import { Table, Image } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import "./VaccineDisplay.scss";

function VaccineDisplay() {
  const [vaccine, setVaccine] = useState([]);

  useEffect(() => {
    document.title = "Vaccine";
  }, []);

  const fetchVaccine = async () => {
    try {
      const response = await api.get("v1/vaccine");
      const filteredData = response.data.data.filter((item) => item.isActive).sort((a, b) => a.price - b.price);
      setVaccine(filteredData);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    fetchVaccine();
  }, []);

  const columns = [
    {
      title: "Tên Vaccine",
      dataIndex: "vaccineName",
      key: "vaccineName",
    },
    {
      title: "Thông tin",
      dataIndex: ["description", "info"],
      key: "info",
    },
    {
      title: "Đối tượng tiêm",
      dataIndex: ["description", "targetedPatient"],
      key: "targetedPatient",
    },
    {
      title: "Lịch tiêm",
      dataIndex: ["description", "injectionSchedule"],
      key: "injectionSchedule",
    },
    {
      title: "Phản ứng vaccine",
      dataIndex: ["description", "vaccineReaction"],
      key: "vaccineReaction",
    },
    {
      title: "Tuổi tối thiểu",
      dataIndex: "minAge",
      key: "minAge",
    },
    {
      title: "Tuổi tối đa",
      dataIndex: "maxAge",
      key: "maxAge",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={100} src={text} alt="Vaccine" />,
    },
    {
      title: "Nhà sản xuất",
      dataIndex: ["manufacturer", "name"],
      key: "manufacturerName",
    },
    {
      title: "Quốc gia",
      dataIndex: ["manufacturer", "countryName"],
      key: "countryName",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN") + " VND",
    },
  ];

  return <Table className="vaccine-table" columns={columns} dataSource={vaccine} rowKey="vaccineId" />;
}

export default VaccineDisplay;
