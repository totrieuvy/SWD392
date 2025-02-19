import { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Select } from "antd";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import "./VaccineSection.scss";

const { Title } = Typography;
const { Option } = Select;

const VaccineSection = () => {
  const [vaccines, setVaccines] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  const fetchVaccines = async () => {
    try {
      const response = await api.get("v1/vaccine");
      if (response.data && response.data.statusCode === 200) {
        setVaccines(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  useEffect(() => {
    fetchVaccines();
    document.title = "Home";
  }, []);

  // Lấy danh sách tên nhà sản xuất duy nhất
  const manufacturerOptions = Array.from(new Set(vaccines.map((vaccine) => vaccine.manufacturer.name)));

  // Lấy danh sách nhóm độ tuổi duy nhất dưới dạng chuỗi "minAge - maxAge" và sắp xếp theo minAge tăng dần
  const ageOptions = Array.from(new Set(vaccines.map((vaccine) => `${vaccine.minAge} - ${vaccine.maxAge}`))).sort(
    (a, b) => {
      const ageA = parseInt(a.split(" - ")[0], 10);
      const ageB = parseInt(b.split(" - ")[0], 10);
      return ageA - ageB;
    }
  );

  // Lọc danh sách vaccine theo nhà sản xuất và nhóm độ tuổi đã chọn
  const filteredVaccines = vaccines.filter((vaccine) => {
    let manufacturerMatch = true;
    let ageMatch = true;

    if (selectedManufacturer) {
      manufacturerMatch = vaccine.manufacturer.name === selectedManufacturer;
    }
    if (selectedAge) {
      const ageGroup = `${vaccine.minAge} - ${vaccine.maxAge}`;
      ageMatch = ageGroup === selectedAge;
    }
    return manufacturerMatch && ageMatch;
  });

  // Sắp xếp danh sách vaccine theo độ tuổi (minAge tăng dần)
  // Nếu minAge bằng nhau thì sắp xếp theo tên vaccine tăng dần
  const sortedVaccines = filteredVaccines.sort((a, b) => {
    if (a.minAge !== b.minAge) {
      return a.minAge - b.minAge;
    }
    return a.vaccineName.localeCompare(b.vaccineName);
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12" style={{ display: "flex", justifyContent: "center" }}>
          Danh sách vaccine
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6}>
            <div className="vaccine-filter-sidebar">
              <div className="filter-item">
                <label>Nhà sản xuất:</label>
                <Select
                  placeholder="Chọn nhà sản xuất"
                  value={selectedManufacturer || undefined}
                  onChange={(value) => setSelectedManufacturer(value)}
                  allowClear
                  style={{ width: "100%" }}
                >
                  {manufacturerOptions.map((manufacturer, index) => (
                    <Option key={index} value={manufacturer}>
                      {manufacturer}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-item">
                <label>Độ tuổi:</label>
                <Select
                  placeholder="Chọn độ tuổi"
                  value={selectedAge || undefined}
                  onChange={(value) => setSelectedAge(value)}
                  allowClear
                  style={{ width: "100%" }}
                >
                  {ageOptions.map((age, index) => (
                    <Option key={index} value={age}>
                      {age} tuổi
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={18}>
            <Row gutter={[16, 16]} justify="start">
              {sortedVaccines.map((vaccine, index) => (
                <Col key={index}>
                  <Link to={`/detail/${vaccine.vaccineId}`}>
                    <Card
                      hoverable
                      cover={<img alt={vaccine.vaccineName} src={vaccine.image} className="vaccine-image" />}
                      className="vaccine-card"
                    >
                      <div className="vaccine-info">
                        <h3 className="vaccine-name">{vaccine.vaccineName}</h3>
                        <p className="vaccine-age">
                          Độ tuổi: {vaccine.minAge} - {vaccine.maxAge} tuổi
                        </p>
                        <p className="vaccine-price">Giá: {vaccine.price.toLocaleString("vi-VN")} VND</p>
                        <p className="vaccine-manufacturer">Nhà sản xuất: {vaccine.manufacturer.name}</p>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default VaccineSection;
