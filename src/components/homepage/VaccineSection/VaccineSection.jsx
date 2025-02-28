import { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Select, Pagination } from "antd";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import "./VaccineSection.scss";

const { Title } = Typography;
const { Option } = Select;

const VaccineSection = () => {
  const [vaccines, setVaccines] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState("");

  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchVaccines = async () => {
    try {
      // Update API call to include pagination parameters
      const response = await api.get(`v1/vaccine?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      if (response.data && response.data.statusCode === 200) {
        setVaccines(response.data.data || []);
        // If the API returns total count in the response, update it
        if (response.data.totalItems) {
          setTotalItems(response.data.totalItems);
        } else if (response.data.data) {
          // Fallback if API doesn't return total count
          setTotalItems(response.data.data.length);
        }
      }
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  useEffect(() => {
    fetchVaccines();
    document.title = "Home";
  }, [pageIndex, pageSize]); // Re-fetch when pagination changes

  // Lấy danh sách tên nhà sản xuất duy nhất
  const manufacturerOptions = Array.from(new Set(vaccines.map((vaccine) => vaccine.manufacturer.name)));

  // Lấy danh sách nhóm độ tuổi duy nhất dạng "minAge - maxAge" và sắp xếp theo minAge tăng dần
  const ageOptions = Array.from(new Set(vaccines.map((vaccine) => `${vaccine.minAge} - ${vaccine.maxAge}`))).sort(
    (a, b) => {
      const ageA = parseInt(a.split(" - ")[0], 10);
      const ageB = parseInt(b.split(" - ")[0], 10);
      return ageA - ageB;
    }
  );

  // Lấy danh sách quốc gia (countryName) duy nhất và sắp xếp theo bảng chữ cái
  const countryOptions = Array.from(new Set(vaccines.map((vaccine) => vaccine.manufacturer.countryName))).sort((a, b) =>
    a.localeCompare(b)
  );

  // Handle filter changes
  const applyFilters = () => {
    // Reset to first page when filters change
    setPageIndex(1);
    fetchVaccines();
  };

  // Lọc danh sách vaccine theo các filter đã chọn
  const filteredVaccines = vaccines.filter((vaccine) => {
    let manufacturerMatch = true;
    let ageMatch = true;
    let countryMatch = true;

    if (selectedManufacturer) {
      manufacturerMatch = vaccine.manufacturer.name === selectedManufacturer;
    }
    if (selectedAge) {
      const ageGroup = `${vaccine.minAge} - ${vaccine.maxAge}`;
      ageMatch = ageGroup === selectedAge;
    }
    if (selectedCountry.length > 0) {
      countryMatch = selectedCountry.includes(vaccine.manufacturer.countryName);
    }
    return manufacturerMatch && ageMatch && countryMatch;
  });

  // Sắp xếp danh sách vaccine
  let sortedVaccines = [...filteredVaccines];
  if (priceSortOrder) {
    sortedVaccines.sort((a, b) => {
      return priceSortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
  } else {
    sortedVaccines.sort((a, b) => {
      if (a.minAge !== b.minAge) {
        return a.minAge - b.minAge;
      }
      return a.vaccineName.localeCompare(b.vaccineName);
    });
  }

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

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
                  onChange={(value) => {
                    setSelectedManufacturer(value);
                    applyFilters();
                  }}
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
                  onChange={(value) => {
                    setSelectedAge(value);
                    applyFilters();
                  }}
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
              <div className="filter-item">
                <label>Quốc gia:</label>
                <Select
                  mode="multiple"
                  placeholder="Chọn quốc gia"
                  value={selectedCountry}
                  onChange={(value) => {
                    setSelectedCountry(value);
                    applyFilters();
                  }}
                  allowClear
                  style={{ width: "100%" }}
                >
                  {countryOptions.map((country, index) => (
                    <Option key={index} value={country}>
                      {country}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-item">
                <label>Sắp xếp theo giá:</label>
                <Select
                  placeholder="Chọn sắp xếp"
                  value={priceSortOrder || undefined}
                  onChange={(value) => {
                    setPriceSortOrder(value);
                    applyFilters();
                  }}
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="asc">Tăng dần</Option>
                  <Option value="desc">Giảm dần</Option>
                </Select>
              </div>
            </div>
          </Col>
          {/* Danh sách card */}
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
                        <p className="vaccine-country">Quốc gia: {vaccine.manufacturer.countryName}</p>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
            {/* Pagination controls */}
            <Row className="mt-6" justify="center">
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Tổng cộng ${total} vaccine`}
              />
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default VaccineSection;
