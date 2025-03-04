import { useEffect, useState } from "react";
import { Form, Row, Col, Checkbox, DatePicker, message, Space, Tag, List, Typography, Empty } from "antd";
import api from "../../../../config/axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import "./VaccinationSection.scss";

const { Title, Text } = Typography;

const VaccinationSection = () => {
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [vaccinationDate, setVaccinationDate] = useState(null);
  const [scheduledVaccines, setScheduledVaccines] = useState([]);
  const [temporarySchedules, setTemporarySchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateSelectionLoading, setDateSelectionLoading] = useState(false);

  // Get childId from Redux store
  const selectedVaccinatedChild = useSelector((state) => state.selectedVaccinatedChild.selectedChild);
  const childId = selectedVaccinatedChild?.childId || "";
  const childName = selectedVaccinatedChild?.fullName || "";

  useEffect(() => {
    const fetchVaccines = async () => {
      if (!childId) return;

      try {
        setLoading(true);
        const response = await api.get("v1/vaccine", {
          params: {
            pageIndex: 1,
            pageSize: 1000,
          },
        });
        if (response.data && response.data.data) {
          const validVaccines = response.data.data.filter(
            (vaccine) =>
              vaccine.minAge !== null && vaccine.maxAge !== null && vaccine.minAge >= 0 && vaccine.maxAge <= 8
          );
          setVaccines(validVaccines);
        }
      } catch (error) {
        console.error("Error fetching vaccines:", error);
        message.error("Failed to load vaccines");
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
    // Reset selections when child changes
    setSelectedVaccines([]);
    setVaccinationDate(null);
    setScheduledVaccines([]);
    setTemporarySchedules([]);
  }, [childId]);

  const handleCheckboxChange = (vaccineId) => {
    setSelectedVaccines((prev) => {
      const newSelection = prev.includes(vaccineId) ? prev.filter((id) => id !== vaccineId) : [...prev, vaccineId];

      // Clear temporary schedules when selection changes
      setTemporarySchedules([]);
      return newSelection;
    });
  };

  const handleDateChange = async (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setVaccinationDate(formattedDate);

    // Clear temporary schedules if date is cleared
    if (!formattedDate) {
      setTemporarySchedules([]);
      return;
    }

    // Only fetch temporary schedules if vaccines are selected
    if (selectedVaccines.length === 0) {
      message.warning("Please select at least one vaccine first");
      return;
    }

    await fetchTemporarySchedules(formattedDate);
  };

  const fetchTemporarySchedules = async (date) => {
    if (!childId || selectedVaccines.length === 0 || !date) {
      return;
    }

    try {
      setDateSelectionLoading(true);

      // Create the request payload
      const scheduleRequest = {
        vaccineIds: selectedVaccines,
        childId: childId,
        startDate: date,
      };

      // Call the API to get temporary schedules
      const response = await api.post("schedule", [scheduleRequest]);

      if (response.data && response.data.code === "Success") {
        setTemporarySchedules(response.data.data || []);
        message.success("Vaccination schedule preview generated");
      } else {
        message.error("Failed to generate vaccination schedule preview");
      }
    } catch (error) {
      console.error("Error fetching temporary schedules:", error);
      message.error(error.response?.data?.message || "Error occurred while fetching temporary schedules");
    } finally {
      setDateSelectionLoading(false);
    }
  };

  const submitSchedule = async () => {
    if (!childId) {
      message.error("No child selected. Please select a child first.");
      return;
    }

    if (selectedVaccines.length === 0) {
      message.warning("Please select at least one vaccine");
      return;
    }

    if (!vaccinationDate) {
      message.warning("Please select a vaccination date");
      return;
    }

    if (temporarySchedules.length === 0) {
      message.warning("Please wait for the schedule preview to be generated");
      return;
    }

    try {
      setLoading(true);

      // Create the request payload with the new format
      const scheduleRequest = {
        vaccineIds: selectedVaccines,
        childId: childId,
        startDate: vaccinationDate,
      };

      // Call the API to confirm the schedule
      const response = await api.post("schedule", [scheduleRequest]);

      if (response.data && response.data.code === "Success") {
        message.success("Vaccination schedule created successfully");
        // Update the list of scheduled vaccines
        setScheduledVaccines(response.data.data || []);
        // Clear temporary schedules after confirmation
        setTemporarySchedules([]);
      } else {
        message.error("Failed to schedule vaccinations");
      }
    } catch (error) {
      console.error("Error scheduling vaccines:", error);
      message.error("Error occurred while scheduling vaccines");
    } finally {
      setLoading(false);
    }
  };

  // Group vaccines by age range
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

  // Sort the groups by minAge
  const sortedVaccineGroups = Object.entries(vaccineGroups).sort((a, b) => {
    const minAgeA = parseInt(a[0].split(" - ")[0].trim(), 10);
    const minAgeB = parseInt(b[0].split(" - ")[0].trim(), 10);
    return minAgeA - minAgeB;
  });

  // Toggle group expansion
  const toggleGroup = (ageGroup) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [ageGroup]: !prev[ageGroup],
    }));
  };

  // Calculate total price of selected vaccines
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

  // Get selected vaccine details for display
  const getSelectedVaccineDetails = () => {
    return vaccines.filter((vaccine) => selectedVaccines.includes(vaccine.vaccineId));
  };

  // Safely get string value from potentially nested object or return fallback
  const getNestedStringValue = (obj, path, fallback = "Not specified") => {
    if (!obj) return fallback;

    // Handle string paths like "description.info"
    if (typeof path === "string") {
      const keys = path.split(".");
      let result = obj;

      for (const key of keys) {
        if (result === null || result === undefined || typeof result !== "object") {
          return fallback;
        }
        result = result[key];
      }

      // Return the result if it's a primitive value, otherwise use fallback
      return result === null || result === undefined || typeof result === "object" ? fallback : String(result);
    }

    return fallback;
  };

  // Render vaccine card with checkbox
  const renderVaccineCard = (vaccine) => (
    <Col xs={24} sm={12} md={8} lg={8} key={vaccine.vaccineId}>
      <div className="vaccine-card">
        <img className="vaccine-card__image" alt={vaccine.vaccineName} src={vaccine.image} />
        <div className="vaccine-card__content">
          <Checkbox
            className="vaccine-card__checkbox"
            checked={selectedVaccines.includes(vaccine.vaccineId)}
            onChange={() => handleCheckboxChange(vaccine.vaccineId)}
          >
            <div className="vaccine-card__title">{vaccine.vaccineName}</div>
            <div className="vaccine-card__description">{getNestedStringValue(vaccine, "description.info")}</div>
            <div className="vaccine-card__origin">
              Nguồn gốc: {getNestedStringValue(vaccine, "manufacturer.name")}({getNestedStringValue(vaccine)})
            </div>
            <div className="vaccine-card__price">{new Intl.NumberFormat("vi-VN").format(vaccine.price)} đ</div>
          </Checkbox>
        </div>
      </div>
    </Col>
  );

  // Render the selected vaccines list on the right side
  const renderSelectedVaccinesList = () => {
    const selectedVaccineDetails = getSelectedVaccineDetails();

    return (
      <div className="selected-vaccines">
        <div className="selected-vaccines__header">DANH SÁCH VẮC XIN CHỌN MUA</div>

        {childName && <div className="selected-vaccines__child-name">Child: {childName}</div>}

        {selectedVaccineDetails.length === 0 ? (
          <div className="selected-vaccines__empty">No vaccines selected yet</div>
        ) : (
          <>
            <div className="selected-vaccines__list">
              {selectedVaccineDetails.map((vaccine) => (
                <div key={vaccine.vaccineId} className="selected-vaccines__item">
                  <div className="selected-vaccines__item-header">
                    <div>
                      <div className="selected-vaccines__item-title">{vaccine.vaccineName}</div>
                      <div className="selected-vaccines__item-origin">
                        Nguồn gốc: {getNestedStringValue(vaccine, "manufacturer.name")}({getNestedStringValue(vaccine)})
                      </div>
                    </div>
                    <button
                      className="selected-vaccines__item-remove"
                      onClick={() => handleCheckboxChange(vaccine.vaccineId)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="selected-vaccines__item-price">
                    {new Intl.NumberFormat("vi-VN").format(vaccine.price)} VND
                  </div>
                </div>
              ))}
            </div>

            <div className="selected-vaccines__date-picker">
              <label className="selected-vaccines__date-label">Ngày bắt đầu chích:</label>
              <DatePicker
                placeholder="Select vaccination date"
                className="selected-vaccines__date-input"
                onChange={handleDateChange}
                value={vaccinationDate ? dayjs(vaccinationDate) : null}
                disabled={selectedVaccines.length === 0 || dateSelectionLoading}
              />
              {dateSelectionLoading && <div className="selected-vaccines__loading">Loading schedule preview...</div>}
            </div>

            <div className="selected-vaccines__total">
              <span className="selected-vaccines__total-label">Tổng cộng:</span>
              <span className="selected-vaccines__total-amount">{calculateTotal()}</span>
            </div>

            <button
              className="selected-vaccines__button"
              onClick={submitSchedule}
              disabled={
                !childId ||
                selectedVaccines.length === 0 ||
                !vaccinationDate ||
                temporarySchedules.length === 0 ||
                loading
              }
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ MŨI TIÊM"}
            </button>
          </>
        )}
      </div>
    );
  };

  // Render temporary schedules preview
  const renderTemporarySchedules = () => {
    if (temporarySchedules.length === 0) return null;

    // Group temporary schedules by vaccine type
    const groupedByType = temporarySchedules.reduce((acc, schedule) => {
      if (!acc[schedule.vaccineType]) {
        acc[schedule.vaccineType] = [];
      }
      acc[schedule.vaccineType].push(schedule);
      return acc;
    }, {});

    return (
      <div className="temporary-schedules">
        <div className="temporary-schedules__header">Lịch Tiêm Chủng Dự Kiến</div>
        <div className="temporary-schedules__note">
          Lịch trình bên dưới là dự kiến. Nhấn ĐĂNG KÝ MŨI TIÊM để xác nhận.
        </div>

        {Object.entries(groupedByType).map(([vaccineType, schedules]) => (
          <div key={vaccineType} className="temporary-schedules__type-group">
            <Title level={5} className="temporary-schedules__type-title">
              {vaccineType}
            </Title>
            <List
              dataSource={schedules}
              renderItem={(item) => (
                <List.Item className="temporary-schedules__list-item">
                  <Space direction="vertical" className="temporary-schedules__item-details">
                    <Text className="temporary-schedules__date">
                      Ngày tiêm: {dayjs(item.scheduleDate).format("DD/MM/YYYY")}
                    </Text>
                    <Space>
                      <Text>Trạng thái:</Text>
                      <Tag color="blue" className="temporary-schedules__status-tag">
                        Dự kiến
                      </Tag>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render scheduled vaccines with clear grouping by vaccine type
  const renderScheduledVaccines = () => {
    if (scheduledVaccines.length === 0) return null;

    // Group scheduled vaccines by type
    const groupedByType = scheduledVaccines.reduce((acc, vaccine) => {
      if (!acc[vaccine.vaccineType]) {
        acc[vaccine.vaccineType] = [];
      }
      acc[vaccine.vaccineType].push(vaccine);
      return acc;
    }, {});

    return (
      <div className="scheduled-vaccines">
        <div className="scheduled-vaccines__header">Lịch Tiêm Chủng Đã Đăng Ký</div>

        {Object.entries(groupedByType).map(([vaccineType, vaccines]) => (
          <div key={vaccineType} className="scheduled-vaccines__type-group">
            <Title level={5} className="scheduled-vaccines__type-title">
              {vaccineType}
            </Title>
            <List
              dataSource={vaccines}
              renderItem={(item) => (
                <List.Item className="scheduled-vaccines__list-item">
                  <Space direction="vertical" className="scheduled-vaccines__item-details">
                    <Text className="scheduled-vaccines__date">
                      Ngày tiêm: {dayjs(item.scheduleDate).format("DD/MM/YYYY")}
                    </Text>
                    <Space>
                      <Text>Trạng thái:</Text>
                      <Tag
                        color={item.scheduleStatus === "Pending" ? "orange" : "green"}
                        className="scheduled-vaccines__status-tag"
                      >
                        {item.scheduleStatus === "Pending" ? "Chờ tiêm" : "Đã tiêm"}
                      </Tag>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!childId) {
    return (
      <div className="vaccination-section">
        <div className="empty-state">
          <Empty description="Please select a child to view vaccination options" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-section">
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Form.Item label="Vaccination" className="mt-4">
            {loading ? (
              <div className="loading-state">Loading vaccines...</div>
            ) : (
              sortedVaccineGroups.map(([ageRange, vaccinesInGroup]) => (
                <div key={ageRange} className="age-group">
                  <div className="age-group__header" onClick={() => toggleGroup(ageRange)}>
                    <div className="age-group__header-text">
                      <span className={`icon ${expandedGroups[ageRange] ? "icon--expanded" : ""}`}>
                        {expandedGroups[ageRange] ? "▲" : "▼"}
                      </span>
                      Vaccine for {ageRange} years
                    </div>
                  </div>
                  {expandedGroups[ageRange] && (
                    <div className="age-group__content">
                      <Row gutter={[16, 16]}>{vaccinesInGroup.map((vaccine) => renderVaccineCard(vaccine))}</Row>
                    </div>
                  )}
                </div>
              ))
            )}
          </Form.Item>
        </Col>

        <Col xs={24} md={8} className="vaccines-sidebar">
          <div className="sidebar-content">
            {renderSelectedVaccinesList()}
            {renderTemporarySchedules()}
            {renderScheduledVaccines()}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VaccinationSection;
