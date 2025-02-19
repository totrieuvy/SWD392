import { useEffect, useState } from "react";
import { Typography, Row, Col, Card } from "antd";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import api from "../../../config/axios";
import "./VaccineSection.scss";

const { Title } = Typography;

const VaccineSection = () => {
  const [vaccines, setVaccines] = useState([]);

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12">
          Vaccines
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {vaccines.map((vaccine, index) => (
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
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default VaccineSection;
