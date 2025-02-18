import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Checkbox, Collapse } from "antd";
import api from "../../../../config/axios";

const { Panel } = Collapse;

const VaccinationPackageSection = () => {
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("v1/package");
        if (response.data && response.data.data) {
          // Chỉ lấy các package có minAge và maxAge không null và nằm trong khoảng 0 - 8
          const validPackages = response.data.data.filter(
            (pkg) => pkg.minAge !== null && pkg.maxAge !== null && pkg.minAge >= 0 && pkg.maxAge <= 8
          );
          setPackages(validPackages);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleCheckboxChange = (vaccineId) => {
    setSelectedVaccines((prev) =>
      prev.includes(vaccineId) ? prev.filter((id) => id !== vaccineId) : [...prev, vaccineId]
    );
  };

  // Nhóm các package theo khoảng tuổi (ví dụ "0 - 1", "1 - 2", …)
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

  const packageGroups = groupPackagesByAge();

  // Sắp xếp các nhóm theo minAge tăng dần
  const sortedPackageGroups = Object.entries(packageGroups).sort((a, b) => {
    const minAgeA = parseInt(a[0].split("-")[0].trim(), 10);
    const minAgeB = parseInt(b[0].split("-")[0].trim(), 10);
    return minAgeA - minAgeB;
  });

  // Tính tổng tiền từ các vaccine được chọn
  const calculateTotal = () => {
    // Lấy tất cả các vaccine từ tất cả các package
    const allVaccines = packages.flatMap((pkg) => pkg.vaccines || []);
    const total = allVaccines
      .filter((vaccine) => selectedVaccines.includes(vaccine.vaccineId))
      .reduce((sum, vaccine) => sum + vaccine.price, 0);

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(total);
  };

  return (
    <>
      <Form.Item label="Vaccination Package" className="mt-4">
        <Collapse>
          {sortedPackageGroups.map(([ageRange, packagesInGroup]) => (
            <Panel header={`Package for ${ageRange} years`} key={ageRange}>
              {packagesInGroup.map((pkg) => (
                <Card
                  key={pkg.packageId}
                  className="w-full mb-4"
                  title={pkg.packageName}
                  extra={<span>{new Intl.NumberFormat("vi-VN").format(pkg.price)} đ</span>}
                >
                  <p>{pkg.description}</p>
                  {pkg.vaccines && pkg.vaccines.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {pkg.vaccines.map((vaccine) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={vaccine.vaccineId}>
                          <Card
                            className="w-full cursor-pointer hover:shadow-md transition-shadow"
                            style={{ marginBottom: "16px" }}
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
                      ))}
                    </Row>
                  ) : (
                    <p>No vaccines available</p>
                  )}
                </Card>
              ))}
            </Panel>
          ))}
        </Collapse>
      </Form.Item>

      <div className="flex justify-end items-center mt-4 text-lg">
        <span className="font-bold mr-4">Total: </span>
        <span className="text-blue-600 font-bold">{calculateTotal()}</span>
      </div>
    </>
  );
};

export default VaccinationPackageSection;
