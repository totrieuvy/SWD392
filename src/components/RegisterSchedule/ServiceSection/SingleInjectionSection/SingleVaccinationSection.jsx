import { useEffect, useState } from "react";
import { Form, Row, Col, Checkbox, DatePicker, message, Space, Tag, List, Typography, Empty, Pagination } from "antd";
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

  // Lấy childId từ Redux store
  const selectedVaccinatedChild = useSelector((state) => state.selectedVaccinatedChild.selectedChild);
  const childId = selectedVaccinatedChild?.childId || "";
  const childName = selectedVaccinatedChild?.fullName || "";
  const childDob = selectedVaccinatedChild?.dob || "";
  const childGender = selectedVaccinatedChild?.gender || "";
  const childAddress = selectedVaccinatedChild?.address || "";
  const childAge = childDob ? calculateChildAgeInMonths(childDob) : null;

  // Lấy userId từ Redux store
  const user = useSelector((state) => state.user);
  const userId = user?.userId || "";

  // Tính tuổi của trẻ theo tháng dựa trên ngày sinh
  function calculateChildAgeInMonths(dobString) {
    if (!dobString) return null;
    const dob = dayjs(dobString);
    return dayjs().diff(dob, "month", true); // Lấy tuổi theo tháng với độ chính xác thập phân
  }

  const fetchVaccines = async (page = 1) => {
    if (!childId) return;

    try {
      setLoading(true);
      // Đảm bảo pageIndex ít nhất là 1
      const pageIndex = Math.max(1, page);

      const response = await api.get("v1/vaccine?pageIndex=1&pageSize=10000", {
        params: {
          pageIndex: pageIndex,
        },
      });

      if (response.data && response.data.data) {
        // Lọc vắc-xin với phạm vi tuổi hợp lệ (đổi từ năm sang tháng)
        const validVaccines = response.data.data.filter(
          (vaccine) => vaccine.minAge !== null && vaccine.maxAge !== null && vaccine.minAge >= 0 && vaccine.maxAge <= 96
        );

        setVaccines(validVaccines);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách vắc-xin:", error);
      message.error("Không thể tải danh sách vắc-xin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines(1); // Đặt lại về trang 1 khi thay đổi thông tin trẻ

    // Đặt lại các lựa chọn khi thay đổi thông tin trẻ
    setSelectedVaccines([]);
    setVaccinationDate(null);
    setScheduledVaccines([]);
    setTemporarySchedules([]);

    // Mở rộng các nhóm tuổi có liên quan đến tuổi của trẻ
    if (childAge !== null) {
      const relevantGroups = {};
      // Mở rộng các nhóm liên quan đến tuổi của trẻ
      Object.keys(groupVaccinesByAge()).forEach((ageRange) => {
        const [minAge, maxAge] = ageRange.split(" - ").map((age) => parseFloat(age));
        if (childAge >= minAge && childAge <= maxAge) {
          relevantGroups[ageRange] = true;
        }
      });
      setExpandedGroups(relevantGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  const handlePageChange = (page) => {
    fetchVaccines(page);
  };

  const handleCheckboxChange = (vaccineId) => {
    setSelectedVaccines((prev) => {
      const newSelection = prev.includes(vaccineId) ? prev.filter((id) => id !== vaccineId) : [...prev, vaccineId];

      // Xóa lịch trình tạm thời khi thay đổi lựa chọn
      setTemporarySchedules([]);
      return newSelection;
    });
  };

  const handleDateChange = async (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setVaccinationDate(formattedDate);

    // Xóa lịch trình tạm thời nếu ngày được xóa
    if (!formattedDate) {
      setTemporarySchedules([]);
      return;
    }

    // Chỉ tải lịch trình tạm thời nếu đã chọn vắc-xin
    if (selectedVaccines.length === 0) {
      message.warning("Vui lòng chọn ít nhất một vắc-xin trước");
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

      // Tạo payload cho yêu cầu
      const scheduleRequest = {
        vaccineIds: selectedVaccines,
        childId: childId,
        startDate: date,
      };

      // Gọi API để lấy lịch trình tạm thời
      const response = await api.post("schedule", [scheduleRequest]);

      if (response.data && response.data.code === "Success") {
        setTemporarySchedules(response.data.data || []);
        message.success("Đã tạo xem trước lịch tiêm chủng");
      } else {
        message.error("Không thể tạo xem trước lịch tiêm chủng");
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch trình tạm thời:", error);
      message.error(error.response?.data?.message || "Đã xảy ra lỗi khi tải lịch trình tạm thời");
    } finally {
      setDateSelectionLoading(false);
    }
  };

  // Tính tổng giá của các vắc-xin đã chọn
  const calculateTotal = () => {
    const total = vaccines
      .filter((vaccine) => selectedVaccines.includes(vaccine.vaccineId))
      .reduce((sum, vaccine) => sum + vaccine.price, 0);

    return total;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    // Chuyển từ YYYY-MM-DD sang DD-MM-YYYY
    const date = dayjs(dateString);
    return date.format("DD-MM-YYYY");
  };

  const submitSchedule = async () => {
    if (!childId) {
      message.error("Chưa chọn trẻ. Vui lòng chọn trẻ trước.");
      return;
    }

    if (!userId) {
      message.error("Thông tin người dùng không khả dụng. Vui lòng đăng nhập lại.");
      return;
    }

    if (selectedVaccines.length === 0) {
      message.warning("Vui lòng chọn ít nhất một vắc-xin");
      return;
    }

    if (!vaccinationDate) {
      message.warning("Vui lòng chọn ngày tiêm chủng");
      return;
    }

    try {
      setLoading(true);

      // Định dạng ngày thành DD-MM-YYYY cho API đặt hàng
      const formattedInjectionDate = formatDateForAPI(vaccinationDate);

      // 1. Trước tiên tạo đơn hàng sử dụng định dạng API mới
      const orderPayload = {
        userId: userId,
        childId: childId,
        fullName: childName,
        dob: childDob,
        gender: childGender,
        address: childAddress,
        injectionDate: formattedInjectionDate,
        amount: calculateTotal(),
        vaccineIdList: selectedVaccines,
      };

      console.log("Payload đơn hàng:", orderPayload);
      // Gọi API đặt hàng
      const orderResponse = await api.post("order", orderPayload);

      if (orderResponse.data && orderResponse.data.code === "Success") {
        message.success("Đã tạo đơn hàng tiêm chủng thành công");

        // Xử lý chuyển hướng đến URL thanh toán nếu có trong phản hồi
        if (orderResponse.data.data) {
          // Chuyển hướng đến URL thanh toán
          window.location.href = orderResponse.data.data;
          return; // Thoát sớm vì chúng ta đang chuyển hướng
        }

        // Nếu không có URL thanh toán, tiếp tục với việc tạo lịch trình
        // 2. Sau đó tạo lịch trình như trước (sử dụng định dạng YYYY-MM-DD ban đầu)
        const scheduleRequest = {
          vaccineIds: selectedVaccines,
          childId: childId,
          startDate: vaccinationDate, // Giữ định dạng ban đầu cho API lịch trình
        };

        const scheduleResponse = await api.post("schedule", [scheduleRequest]);

        if (scheduleResponse.data && scheduleResponse.data.code === "Success") {
          message.success("Đã tạo lịch tiêm chủng thành công");
          // Cập nhật danh sách lịch trình đã đặt
          setScheduledVaccines(scheduleResponse.data.data || []);
          // Xóa lịch trình tạm thời sau khi xác nhận
          setTemporarySchedules([]);
          // Xóa các vắc-xin đã chọn sau khi gửi thành công
          setSelectedVaccines([]);
          setVaccinationDate(null);
        } else {
          message.error("Không thể lên lịch tiêm chủng");
        }
      } else {
        message.error("Không thể tạo đơn hàng tiêm chủng");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu tiêm chủng:", error);
      message.error(error.response?.data?.message || "Đã xảy ra lỗi khi xử lý yêu cầu của bạn");
    } finally {
      setLoading(false);
    }
  };

  // Nhóm vắc-xin theo phạm vi tuổi (tháng)
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

  // Lấy nhóm vắc-xin với bộ lọc dựa trên tuổi của trẻ nếu có
  const getVaccineGroups = () => {
    const vaccineGroups = groupVaccinesByAge();

    // Sắp xếp các nhóm theo minAge
    return Object.entries(vaccineGroups).sort((a, b) => {
      const minAgeA = parseFloat(a[0].split(" - ")[0].trim());
      const minAgeB = parseFloat(b[0].split(" - ")[0].trim());
      return minAgeA - minAgeB;
    });
  };

  // Chuyển đổi mở rộng nhóm
  const toggleGroup = (ageGroup) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [ageGroup]: !prev[ageGroup],
    }));
  };

  // Định dạng tổng giá để hiển thị
  const formatTotalPrice = () => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(calculateTotal());
  };

  // Lấy chi tiết vắc-xin đã chọn để hiển thị
  const getSelectedVaccineDetails = () => {
    return vaccines.filter((vaccine) => selectedVaccines.includes(vaccine.vaccineId));
  };

  // Lấy giá trị chuỗi an toàn từ đối tượng có thể lồng nhau hoặc trả về giá trị mặc định
  const getNestedStringValue = (obj, path, fallback = "Không xác định") => {
    if (!obj) return fallback;

    // Xử lý đường dẫn chuỗi như "description.info"
    if (typeof path === "string") {
      const keys = path.split(".");
      let result = obj;

      for (const key of keys) {
        if (result === null || result === undefined || typeof result !== "object") {
          return fallback;
        }
        result = result[key];
      }

      // Trả về kết quả nếu là giá trị nguyên thủy, nếu không sử dụng giá trị mặc định
      return result === null || result === undefined || typeof result === "object" ? fallback : String(result);
    }

    return fallback;
  };

  // Hiển thị thẻ phù hợp với độ tuổi nếu vắc-xin phù hợp với tuổi của trẻ
  const isVaccineAppropriateForChild = (vaccine) => {
    if (childAge === null) return false;
    return childAge >= vaccine.minAge && childAge <= vaccine.maxAge;
  };

  // Chuyển đổi tháng sang định dạng hiển thị
  const formatMonthRangeToDisplay = (minMonth, maxMonth) => {
    if (minMonth === 0 && maxMonth < 12) {
      return `${maxMonth} tháng đầu`;
    } else {
      return `${minMonth} - ${maxMonth} tháng`;
    }
  };

  // Hiển thị vắc-xin với checkbox
  const renderVaccineCard = (vaccine) => (
    <Col xs={24} sm={12} md={8} lg={8} key={vaccine.vaccineId}>
      <div className={`vaccine-card ${isVaccineAppropriateForChild(vaccine) ? "vaccine-card--appropriate" : ""}`}>
        <img className="vaccine-card__image" alt={vaccine.vaccineName} src={vaccine.image} />
        <div className="vaccine-card__content">
          <Checkbox
            className="vaccine-card__checkbox"
            checked={selectedVaccines.includes(vaccine.vaccineId)}
            onChange={() => handleCheckboxChange(vaccine.vaccineId)}
          >
            <div className="vaccine-card__title">{vaccine.vaccineName}</div>
            {isVaccineAppropriateForChild(vaccine) && (
              <Tag color="green" className="vaccine-card__appropriate-tag">
                Phù hợp với độ tuổi trẻ
              </Tag>
            )}
            <div className="vaccine-card__description">{getNestedStringValue(vaccine, "description.info")}</div>
            <div className="vaccine-card__origin">
              Nguồn gốc: {getNestedStringValue(vaccine, "manufacturer.name")}(
              {getNestedStringValue(vaccine, "manufacturer.countryCode")})
            </div>
            <div className="vaccine-card__price">{new Intl.NumberFormat("vi-VN").format(vaccine.price)} đ</div>
          </Checkbox>
        </div>
      </div>
    </Col>
  );

  // Hiển thị danh sách vắc-xin đã chọn ở bên phải
  const renderSelectedVaccinesList = () => {
    const selectedVaccineDetails = getSelectedVaccineDetails();

    return (
      <div className="selected-vaccines">
        <div className="selected-vaccines__header">DANH SÁCH VẮC XIN CHỌN MUA</div>

        {childName && <div className="selected-vaccines__child-name">Trẻ: {childName}</div>}
        {childAge !== null && <div className="selected-vaccines__child-age">Tuổi: {childAge.toFixed(1)} tháng</div>}

        {selectedVaccineDetails.length === 0 ? (
          <div className="selected-vaccines__empty">Chưa chọn vắc-xin nào</div>
        ) : (
          <>
            <div className="selected-vaccines__list">
              {selectedVaccineDetails.map((vaccine) => (
                <div key={vaccine.vaccineId} className="selected-vaccines__item">
                  <div className="selected-vaccines__item-header">
                    <div>
                      <div className="selected-vaccines__item-title">{vaccine.vaccineName}</div>
                      <div className="selected-vaccines__item-origin">
                        Nguồn gốc: {getNestedStringValue(vaccine, "manufacturer.name")}(
                        {getNestedStringValue(vaccine, "manufacturer.countryCode")})
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
                placeholder="Chọn ngày tiêm chủng"
                className="selected-vaccines__date-input"
                onChange={handleDateChange}
                value={vaccinationDate ? dayjs(vaccinationDate) : null}
                disabled={selectedVaccines.length === 0 || dateSelectionLoading}
              />
              {dateSelectionLoading && (
                <div className="selected-vaccines__loading">Đang tải xem trước lịch trình...</div>
              )}
            </div>

            <div className="selected-vaccines__total">
              <span className="selected-vaccines__total-label">Tổng cộng:</span>
              <span className="selected-vaccines__total-amount">{formatTotalPrice()}</span>
            </div>

            <button
              className="selected-vaccines__button"
              onClick={submitSchedule}
              disabled={!childId || !userId || selectedVaccines.length === 0 || !vaccinationDate || loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ MŨI TIÊM"}
            </button>
          </>
        )}
      </div>
    );
  };

  // Hiển thị xem trước lịch trình tạm thời
  const renderTemporarySchedules = () => {
    if (temporarySchedules.length === 0) return null;

    // Nhóm lịch trình tạm thời theo loại vắc-xin
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

  // Hiển thị vắc-xin đã lên lịch với phân nhóm rõ ràng theo loại vắc-xin
  const renderScheduledVaccines = () => {
    if (scheduledVaccines.length === 0) return null;

    // Nhóm vắc-xin đã lên lịch theo loại
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
          <Empty description="Vui lòng chọn trẻ để xem các tùy chọn tiêm chủng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-section">
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Form.Item label="Tiêm chủng" className="mt-4">
            {loading ? (
              <div className="loading-state">Đang tải danh sách vắc-xin...</div>
            ) : (
              <>
                {childAge !== null && (
                  <div className="child-age-info">
                    <Tag color="blue">Tuổi trẻ: {childAge.toFixed(1)} tháng</Tag>
                    <p className="age-appropriate-notice">
                      Vắc-xin phù hợp với độ tuổi của trẻ được đánh dấu và mở rộng mặc định.
                    </p>
                  </div>
                )}

                {getVaccineGroups().map(([ageRange, vaccinesInGroup]) => {
                  const [minAge, maxAge] = ageRange.split(" - ").map(parseFloat);
                  const displayRange = formatMonthRangeToDisplay(minAge, maxAge);

                  return (
                    <div key={ageRange} className="age-group">
                      <div className="age-group__header" onClick={() => toggleGroup(ageRange)}>
                        <div className="age-group__header-text">
                          <span className={`icon ${expandedGroups[ageRange] ? "icon--expanded" : ""}`}>
                            {expandedGroups[ageRange] ? "▲" : "▼"}
                          </span>
                          Vắc-xin cho trẻ {displayRange}
                          {childAge !== null && childAge >= minAge && childAge <= maxAge && (
                            <Tag color="green" className="age-group__appropriate-tag">
                              Khuyến nghị cho trẻ của bạn
                            </Tag>
                          )}
                        </div>
                      </div>
                      {expandedGroups[ageRange] && (
                        <div className="age-group__content">
                          <Row gutter={[16, 16]}>{vaccinesInGroup.map((vaccine) => renderVaccineCard(vaccine))}</Row>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
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
