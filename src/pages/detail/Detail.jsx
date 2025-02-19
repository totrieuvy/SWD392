import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Detail.scss";
import api from "../../config/axios";

function Detail() {
  const { vaccineId } = useParams();
  const [vaccine, setVaccine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccineDetail = async () => {
      try {
        const response = await api.get(`v1/vaccine/${vaccineId}`);
        if (response.data && response.data.statusCode === 200) {
          setVaccine(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching vaccine details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineDetail();
  }, [vaccineId]);

  if (loading) {
    return <div className="detail-loading">Loading...</div>;
  }

  if (!vaccine) {
    return <div className="detail-error">Không tìm thấy thông tin vaccine</div>;
  }

  return (
    <div className="vaccine-detail">
      <div className="vaccine-detail__container">
        <div className="vaccine-detail__image-wrapper">
          <img src={vaccine.image} alt={vaccine.vaccineName} className="vaccine-detail__image" />
        </div>
        <div className="vaccine-detail__info">
          <h2 className="vaccine-detail__name">{vaccine.vaccineName}</h2>
          <p className="vaccine-detail__price">Giá: {vaccine.price.toLocaleString("vi-VN")} VND</p>
          <div className="vaccine-detail__section">
            <h3>Thông tin chung</h3>
            <p>
              <strong>Info: </strong>
              {vaccine.description.info}
            </p>
            <p>
              <strong>Đối tượng tiêm chủng: </strong>
              {vaccine.description.targetedPatient}
            </p>
            <p>
              <strong>Lịch tiêm: </strong>
              {vaccine.description.injectionSchedule}
            </p>
            <p>
              <strong>Tác dụng phụ: </strong>
              {vaccine.description.vaccineReaction}
            </p>
          </div>
          <div className="vaccine-detail__section">
            <h3>Thông số</h3>
            <p>
              <strong>Độ tuổi: </strong>
              {vaccine.minAge} - {vaccine.maxAge} tuổi
            </p>
            <p>
              <strong>Số mũi: </strong>
              {vaccine.numberDose}
            </p>
            <p>
              <strong>Thời gian hiệu lực: </strong>
              {vaccine.duration} {vaccine.unit}
            </p>
          </div>
          <div className="vaccine-detail__section">
            <h3>Nhà sản xuất</h3>
            <p>
              <strong>Tên: </strong>
              {vaccine.manufacturer.name}
            </p>
            <p>
              <strong>Quốc gia: </strong>
              {vaccine.manufacturer.countryName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
