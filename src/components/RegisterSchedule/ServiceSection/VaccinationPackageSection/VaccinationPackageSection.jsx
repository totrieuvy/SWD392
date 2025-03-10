import { useEffect, useState } from "react";
import {
  Form,
  Card,
  Row,
  Col,
  Checkbox,
  Collapse,
  DatePicker,
  Button,
  Modal,
  Table,
  message,
  Tag,
  List,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../../config/axios";
import {
  selectPackage,
  replaceVaccine,
  setVaccinationDate,
  resetPackageSelection,
} from "../../../../redux/features/selectedPackageSlice";
import dayjs from "dayjs";
import "./VaccinationPackageSection.scss";

const { Panel } = Collapse;

const VaccinationPackageSection = () => {
  const dispatch = useDispatch();
  const selectedPackage = useSelector((state) => state.selectedPackage);
  const selectedVaccinatedChild = useSelector((state) => state.selectedVaccinatedChild.selectedChild);
  const user = useSelector((state) => state.user);

  const [packages, setPackages] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [alternativeVaccines, setAlternativeVaccines] = useState([]);
  const [temporarySchedules, setTemporarySchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const childId = selectedVaccinatedChild?.childId || "";
  const childName = selectedVaccinatedChild?.fullName || "";
  const childDob = selectedVaccinatedChild?.dob || "";
  const childGender = selectedVaccinatedChild?.gender || "";
  const childAddress = selectedVaccinatedChild?.address || "";
  const childAge = childDob ? calculateChildAge(childDob) : null;

  const userId = user?.userId || "";

  function calculateChildAge(dobString) {
    if (!dobString) return null;
    const dob = dayjs(dobString);
    return dayjs().diff(dob, "month");
  }

  useEffect(() => {
    fetchPackages();
    fetchAllVaccines();
  }, []);

  useEffect(() => {
    if (childId) {
      dispatch(resetPackageSelection());
      setTemporarySchedules([]);
    }
  }, [childId, dispatch]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get("v1/package");
      if (response.data && response.data.data) {
        const validPackages = response.data.data.filter(
          (pkg) => pkg.minAge !== null && pkg.maxAge !== null && pkg.minAge >= 0 && pkg.maxAge <= 96
        );
        setPackages(validPackages);
      }
    } catch (error) {
      console.error("Lỗi khi tải gói tiêm chủng:", error);
      message.error("Không thể tải gói tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVaccines = async () => {
    try {
      const response = await api.get("v1/vaccine/all");
      if (response.data && response.data.data) {
        setAllVaccines(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tất cả vắc-xin:", error);
      message.error("Không thể tải các lựa chọn vắc-xin thay thế");
    }
  };

  const handlePackageSelect = (pkg) => {
    if (selectedPackage.packageId === pkg.packageId) {
      dispatch(resetPackageSelection());
    } else {
      dispatch(
        selectPackage({
          packageId: pkg.packageId,
          packageName: pkg.packageName,
          price: pkg.price,
          vaccines: pkg.vaccines || [],
        })
      );
      setTemporarySchedules([]);
    }
  };

  const openVaccineAlternatives = (vaccine) => {
    setCurrentVaccine(vaccine);

    const alternatives = allVaccines.filter(
      (v) => v.vaccineName === vaccine.vaccineName && v.vaccineId !== vaccine.vaccineId
    );

    setAlternativeVaccines(alternatives);
    setVaccineModalVisible(true);
  };

  const handleVaccineReplace = (newVaccine) => {
    if (currentVaccine) {
      dispatch(
        replaceVaccine({
          originalVaccineId: currentVaccine.vaccineId,
          newVaccine: newVaccine,
        })
      );

      message.success(
        `Đã thay thế vắc-xin bằng phiên bản ${newVaccine.manufacturer.name} (${newVaccine.manufacturer.countryCode})`
      );
      setVaccineModalVisible(false);
      setTemporarySchedules([]);
    }
  };

  const handleDateChange = async (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    dispatch(setVaccinationDate(formattedDate));

    if (!formattedDate) {
      setTemporarySchedules([]);
      return;
    }

    if (!selectedPackage.packageId) {
      message.warning("Vui lòng chọn gói tiêm chủng trước");
      return;
    }

    await fetchTemporarySchedules(formattedDate);
  };

  const fetchTemporarySchedules = async (date) => {
    if (!childId || !selectedPackage.packageId || !date) {
      return;
    }

    try {
      setScheduleLoading(true);

      const vaccineIds = selectedPackage.selectedVaccines.map((vaccine) => vaccine.vaccineId);

      const scheduleRequest = {
        vaccineIds: vaccineIds,
        childId: childId,
        startDate: date,
      };

      const response = await api.post("schedule", [scheduleRequest]);

      if (response.data && response.data.code === "Success") {
        setTemporarySchedules(response.data.data || []);
        message.success("Đã tạo xem trước lịch tiêm chủng");
      } else {
        message.error("Không thể tạo xem trước lịch tiêm chủng");
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch tạm thời:", error);
      message.error(error.response?.data?.message || "Đã xảy ra lỗi khi tải lịch tiêm chủng tạm thời");
    } finally {
      setScheduleLoading(false);
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    return date.format("DD-MM-YYYY");
  };

  const handleSubmitVaccination = () => {
    if (!childId || !selectedPackage.packageId || !selectedPackage.vaccinationDate) {
      message.warning("Vui lòng chọn gói tiêm chủng và ngày tiêm trước");
      return;
    }

    setConfirmModalVisible(true);
  };

  const confirmVaccination = async () => {
    try {
      setLoading(true);

      const vaccineIds = selectedPackage.selectedVaccines.map((vaccine) => vaccine.vaccineId);

      const formattedInjectionDate = formatDateForAPI(selectedPackage.vaccinationDate);

      const orderPayload = {
        userId: userId,
        childId: childId,
        fullName: childName,
        dob: childDob,
        gender: childGender,
        address: childAddress,
        injectionDate: formattedInjectionDate,
        amount: calculateTotalPrice(),
        vaccineIdList: vaccineIds,
      };

      const orderResponse = await api.post("order", orderPayload);

      if (orderResponse.data && orderResponse.data.code === "Success") {
        message.success("Đã tạo đơn hàng tiêm chủng thành công");

        if (orderResponse.data.data) {
          window.location.href = orderResponse.data.data;
          return;
        }

        const scheduleRequest = {
          vaccineIds: vaccineIds,
          childId: childId,
          startDate: selectedPackage.vaccinationDate,
        };

        const scheduleResponse = await api.post("schedule", [scheduleRequest]);

        if (scheduleResponse.data && scheduleResponse.data.code === "Success") {
          message.success("Đã tạo lịch tiêm chủng thành công");
          dispatch(resetPackageSelection());
          setTemporarySchedules([]);
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
      setConfirmModalVisible(false);
    }
  };

  const groupPackagesByAge = () => {
    return packages.reduce((groups, pkg) => {
      if (pkg.minAge === null || pkg.maxAge === null) return groups;
      const ageGroup = `${pkg.minAge} - ${pkg.maxAge}`;
      if (!groups[ageGroup]) {
        groups[ageGroup] = [];
      }
      groups[ageGroup].push(pkg);
      return groups;
    }, {});
  };

  const sortedPackageGroups = () => {
    const packageGroups = groupPackagesByAge();
    return Object.entries(packageGroups).sort((a, b) => {
      const minAgeA = parseInt(a[0].split("-")[0].trim(), 10);
      const minAgeB = parseInt(b[0].split("-")[0].trim(), 10);
      return minAgeA - minAgeB;
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage.packageId) return 0;

    const packageInfo = packages.find((pkg) => pkg.packageId === selectedPackage.packageId);
    if (!packageInfo) return 0;

    let totalVaccinePrice = 0;

    selectedPackage.selectedVaccines.forEach((vaccine) => {
      totalVaccinePrice += vaccine.price;
    });

    let discountAmount = 0;
    if (packageInfo.discount) {
      discountAmount = (totalVaccinePrice * packageInfo.discount) / 100;
    }

    const finalPrice = totalVaccinePrice - discountAmount;

    return finalPrice > 0 ? finalPrice : 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isPackageAppropriateForChild = (pkg) => {
    if (childAge === null) return false;
    return childAge >= pkg.minAge && childAge <= pkg.maxAge;
  };

  const formatMonthRange = (minMonth, maxMonth) => {
    if (minMonth === 0 && maxMonth === 0) {
      return "Sơ sinh";
    }

    let result = "";

    if (minMonth === 0) {
      result = "Sơ sinh";
    } else {
      result = `${minMonth} tháng`;
    }

    result += " - " + `${maxMonth} tháng`;

    return result;
  };

  const renderSelectedPackageDetails = () => {
    if (!selectedPackage.packageId) {
      return (
        <div className="empty-selection">
          <p>Chưa chọn gói. Vui lòng chọn một gói tiêm chủng.</p>
        </div>
      );
    }

    return (
      <div className="selected-package">
        <h3 className="text-lg font-bold mb-3">{selectedPackage.packageName}</h3>

        {childName && <div className="mb-2">Trẻ: {childName}</div>}
        {childAge !== null && (
          <div className="mb-2">
            Tuổi: {childAge} tháng ({(childAge / 12).toFixed(1)} năm)
          </div>
        )}

        <h4 className="text-md font-medium mt-4 mb-2">Vắc-xin đã chọn:</h4>
        <div className="selected-vaccines-list">
          {selectedPackage.selectedVaccines.map((vaccine) => (
            <div
              key={vaccine.vaccineId}
              className="vaccine-item p-3 border rounded mb-2 flex justify-between items-center"
            >
              <div>
                <div className="vaccine-name font-medium">{vaccine.vaccineName}</div>
                <div className="vaccine-origin text-sm text-gray-600">
                  {vaccine.manufacturer?.name} ({vaccine.manufacturer?.countryCode})
                </div>
                <div className="vaccine-price text-blue-600">{formatPrice(vaccine.price)}</div>
              </div>
              <Button type="primary" size="small" onClick={() => openVaccineAlternatives(vaccine)}>
                Đổi phiên bản
              </Button>
            </div>
          ))}
        </div>

        <div className="date-selection mt-4 mb-4">
          <label className="block mb-2">Ngày tiêm chủng:</label>
          <DatePicker
            className="w-full"
            onChange={handleDateChange}
            value={selectedPackage.vaccinationDate ? dayjs(selectedPackage.vaccinationDate) : null}
            placeholder="Chọn ngày tiêm chủng"
            disabled={scheduleLoading}
          />
          {scheduleLoading && <div className="mt-2 text-gray-600">Đang tải xem trước lịch...</div>}
        </div>

        <div className="total-price flex justify-between items-center p-3 bg-gray-100 rounded mb-4">
          <span className="font-bold">Tổng cộng:</span>
          <span className="text-blue-600 font-bold">{formatPrice(calculateTotalPrice())}</span>
        </div>

        <Button
          type="primary"
          className="w-full"
          onClick={handleSubmitVaccination}
          disabled={!selectedPackage.vaccinationDate || loading}
        >
          {loading ? "Đang xử lý..." : "Đăng ký tiêm chủng"}
        </Button>
      </div>
    );
  };

  const renderTemporarySchedules = () => {
    if (temporarySchedules.length === 0) return null;

    const groupedByType = temporarySchedules.reduce((acc, schedule) => {
      if (!acc[schedule.vaccineType]) {
        acc[schedule.vaccineType] = [];
      }
      acc[schedule.vaccineType].push(schedule);
      return acc;
    }, {});

    return (
      <div className="temporary-schedules mt-4 border rounded p-4">
        <h3 className="text-lg font-bold mb-3">Lịch tiêm chủng dự kiến</h3>
        <p className="text-sm text-gray-600 mb-3">
          Đây là xem trước lịch tiêm chủng của bạn. Nhấp Đăng ký tiêm chủng để xác nhận.
        </p>

        {Object.entries(groupedByType).map(([vaccineType, schedules]) => (
          <div key={vaccineType} className="vaccine-type-group mb-4">
            <h4 className="font-medium mb-2">{vaccineType}</h4>
            <List
              bordered
              dataSource={schedules}
              renderItem={(item) => (
                <List.Item className="flex justify-between">
                  <div>{dayjs(item.scheduleDate).format("DD/MM/YYYY")}</div>
                  <Tag color="blue">Xem trước</Tag>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="vaccination-package-section">
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Form.Item label="Gói tiêm chủng" className="mt-4">
              {loading ? (
                <div className="loading-state">
                  <Spin /> Đang tải gói tiêm chủng...
                </div>
              ) : (
                <Collapse>
                  {sortedPackageGroups().map(([ageRange, packagesInGroup]) => {
                    const minMonth = parseInt(ageRange.split(" - ")[0].trim(), 10);
                    const maxMonth = parseInt(ageRange.split(" - ")[1].trim(), 10);
                    return (
                      <Panel
                        header={
                          <div className="flex items-center">
                            <span>Gói cho {formatMonthRange(minMonth, maxMonth)}</span>
                            {childAge !== null && childAge >= minMonth && childAge <= maxMonth && (
                              <Tag color="green" className="ml-2">
                                Khuyến nghị cho con bạn
                              </Tag>
                            )}
                          </div>
                        }
                        key={ageRange}
                      >
                        {packagesInGroup.map((pkg) => (
                          <Card
                            key={pkg.packageId}
                            className={`w-full mb-4 ${
                              selectedPackage.packageId === pkg.packageId ? "border-primary border-2" : ""
                            } ${isPackageAppropriateForChild(pkg) ? "bg-blue-50" : ""}`}
                            title={
                              <div className="flex justify-between items-center">
                                <span>{pkg.packageName}</span>
                                <Checkbox
                                  checked={selectedPackage.packageId === pkg.packageId}
                                  onChange={() => handlePackageSelect(pkg)}
                                />
                              </div>
                            }
                            extra={<span>{formatPrice(pkg.price)}</span>}
                          >
                            <p>{pkg.description}</p>
                            {pkg.vaccines && pkg.vaccines.length > 0 ? (
                              <Row gutter={[16, 16]}>
                                {pkg.vaccines.map((vaccine) => (
                                  <Col xs={24} sm={12} md={8} lg={8} key={vaccine.vaccineId}>
                                    <Card className="w-full">
                                      <div className="font-medium">{vaccine.vaccineName}</div>
                                      <div className="text-gray-500 text-sm">{vaccine.description?.info}</div>
                                      <div className="text-blue-600 mt-2">{formatPrice(vaccine.price)}</div>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            ) : (
                              <p>Không có vắc-xin</p>
                            )}
                          </Card>
                        ))}
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            {renderSelectedPackageDetails()}
            {renderTemporarySchedules()}
          </Col>
        </Row>
      </div>

      <Modal
        title="Chọn vắc-xin thay thế"
        open={vaccineModalVisible}
        onCancel={() => setVaccineModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentVaccine && (
          <div className="current-vaccine-info mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-medium">Vắc-xin hiện tại:</h4>
            <div>{currentVaccine.vaccineName}</div>
            <div className="text-sm">
              {currentVaccine.manufacturer?.name} ({currentVaccine.manufacturer?.countryCode})
            </div>
            <div className="text-blue-600">{formatPrice(currentVaccine.price)}</div>
          </div>
        )}

        {alternativeVaccines.length === 0 ? (
          <div className="text-center p-4">
            <p>Không tìm thấy vắc-xin thay thế có cùng tên.</p>
          </div>
        ) : (
          <Table
            dataSource={alternativeVaccines}
            rowKey="vaccineId"
            pagination={false}
            columns={[
              {
                title: "Vắc-xin",
                dataIndex: "vaccineName",
                key: "vaccineName",
              },
              {
                title: "Nhà sản xuất",
                dataIndex: ["manufacturer", "name"],
                key: "manufacturer",
                render: (text, record) => (
                  <span>
                    {text} ({record.manufacturer?.countryCode})
                  </span>
                ),
              },
              {
                title: "Giá",
                dataIndex: "price",
                key: "price",
                render: (price) => formatPrice(price),
              },
              {
                title: "Hành động",
                key: "action",
                render: (_, record) => (
                  <Button type="primary" onClick={() => handleVaccineReplace(record)}>
                    Chọn
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Modal>

      <Modal
        title="Xác nhận tiêm chủng"
        open={confirmModalVisible}
        onOk={confirmVaccination}
        onCancel={() => setConfirmModalVisible(false)}
        confirmLoading={loading}
      >
        <p>Bạn có chắc chắn muốn đăng ký gói tiêm chủng này không?</p>
        <div className="mt-3">
          <div>
            <strong>Gói:</strong> {selectedPackage.packageName}
          </div>
          <div>
            <strong>Trẻ:</strong> {childName}
          </div>
          <div>
            <strong>Ngày:</strong>{" "}
            {selectedPackage.vaccinationDate && dayjs(selectedPackage.vaccinationDate).format("DD/MM/YYYY")}
          </div>
          <div>
            <strong>Tổng số tiền:</strong> {formatPrice(calculateTotalPrice())}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VaccinationPackageSection;
