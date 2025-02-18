import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Checkbox } from "antd";
import api from "../../../../config/axios";

const VaccinationSection = () => {
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({}); // theo dõi trạng thái mở/đóng từng nhóm

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await api.get("v1/vaccine");
        if (response.data && response.data.data) {
          // Lọc vaccine có minAge và maxAge hợp lệ (0 - 8 years)
          const validVaccines = response.data.data.filter(
            (vaccine) =>
              vaccine.minAge !== null && vaccine.maxAge !== null && vaccine.minAge >= 0 && vaccine.maxAge <= 8
          );
          setVaccines(validVaccines);
        }
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };

    fetchVaccines();
  }, []);

  const handleCheckboxChange = (vaccineId) => {
    setSelectedVaccines((prev) =>
      prev.includes(vaccineId) ? prev.filter((id) => id !== vaccineId) : [...prev, vaccineId]
    );
  };

  // Nhóm các vaccine theo khoảng tuổi (ví dụ: "0 - 1", "1 - 2", …)
  const groupVaccinesByAge = () => {
    return vaccines.reduce((groups, vaccine) => {
      const ageGroup = `${vaccine.minAge} - ${vaccine.maxAge}`;
      if (!groups[ageGroup]) {
        groups[ageGroup] = [];
      }
      groups[ageGroup].push(vaccine);
      return groups;
    }, {});
  };

  const vaccineGroups = groupVaccinesByAge();

  // Sắp xếp các nhóm theo minAge tăng dần
  const sortedVaccineGroups = Object.entries(vaccineGroups).sort((a, b) => {
    const minAgeA = parseInt(a[0].split(" - ")[0].trim(), 10);
    const minAgeB = parseInt(b[0].split(" - ")[0].trim(), 10);
    return minAgeA - minAgeB;
  });

  // Toggle trạng thái mở/đóng của nhóm
  const toggleGroup = (ageGroup) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [ageGroup]: !prev[ageGroup],
    }));
  };

  // Tính tổng tiền của các vaccine được chọn
  const calculateTotal = () => {
    const total = vaccines
      .filter((vaccine) => selectedVaccines.includes(vaccine.vaccineId))
      .reduce((sum, vaccine) => sum + vaccine.price, 0);

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(total);
  };

  // Render từng Card vaccine
  const renderVaccineCard = (vaccine) => (
    <Col xs={24} sm={12} md={8} lg={8} key={vaccine.vaccineId}>
      <Card
        className="w-full cursor-pointer hover:shadow-md transition-shadow"
        style={{ marginBottom: "16px" }}
        cover={<img alt={vaccine.vaccineName} src={vaccine.image} style={{ objectFit: "cover", height: "200px" }} />}
      >
        <Checkbox
          className="w-full"
          checked={selectedVaccines.includes(vaccine.vaccineId)}
          onChange={() => handleCheckboxChange(vaccine.vaccineId)}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex-1">
              <div className="text-base font-medium">{vaccine.vaccineName}</div>
              <div className="text-gray-500 text-sm mt-1">{vaccine.description.info}</div>
            </div>
            <div className="text-blue-600 font-medium text-right mt-2 md:mt-0">
              {new Intl.NumberFormat("vi-VN").format(vaccine.price)} đ
            </div>
          </div>
        </Checkbox>
      </Card>
    </Col>
  );

  return (
    <>
      <Form.Item label="Vaccination" className="mt-4">
        {sortedVaccineGroups.map(([ageRange, vaccinesInGroup]) => (
          <div key={ageRange} style={{ marginBottom: 16 }}>
            {/* Header của nhóm: click để mở/đóng */}
            <div
              style={{
                background: "#fafafa",
                border: "1px solid #d9d9d9",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onClick={() => toggleGroup(ageRange)}
            >
              Vaccine for {ageRange} years {expandedGroups[ageRange] ? "▲" : "▼"}
            </div>
            {/* Nội dung của nhóm, đẩy các phần dưới xuống khi mở */}
            {expandedGroups[ageRange] && (
              <div style={{ padding: "8px 16px", background: "#fff" }}>
                <Row gutter={[16, 16]}>{vaccinesInGroup.map((vaccine) => renderVaccineCard(vaccine))}</Row>
              </div>
            )}
          </div>
        ))}
      </Form.Item>

      <div className="flex justify-end items-center mt-4 text-lg">
        <span className="font-bold mr-4">Total: </span>
        <span className="text-blue-600 font-bold">{calculateTotal()}</span>
      </div>
    </>
  );
};

export default VaccinationSection;
