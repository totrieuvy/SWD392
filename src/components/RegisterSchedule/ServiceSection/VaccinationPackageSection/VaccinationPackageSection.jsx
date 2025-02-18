import React, { useState } from "react";
import { Form, Card, Row, Col, Checkbox, Collapse } from "antd";
const { Panel } = Collapse;

const VaccinationPackageSection = () => {
  const [selectedPackages, setSelectedPackages] = useState([]);

  const vaccinePackages9Months = [
    {
      id: "9m-1",
      name: "Gói vắc xin Hexaxim – Rotarix – Varilrix (0 - 6 tháng)",
      price: "13,434,900 đ",
      numericPrice: 13434900,
    },
    {
      id: "9m-2",
      name: "Gói vắc xin Hexaxim – Rotarix – Varilrix (0 - 9 tháng)",
      price: "17,897,976 đ",
      numericPrice: 17897976,
    },
    {
      id: "9m-3",
      name: "Gói vắc xin Hexaxim – Rotateq – Varilrix (0 - 6 tháng)",
      price: "13,828,200 đ",
      numericPrice: 13828200,
    },
  ];

  const vaccinePackages12Months = [
    {
      id: "12m-1",
      name: "Gói vắc xin Hexaxim – Rotarix – Varilrix (0 - 12 tháng)",
      price: "14,434,900 đ",
      numericPrice: 14434900,
    },
    {
      id: "12m-2",
      name: "Gói vắc xin Hexaxim – Rotarix – Varilrix (0 - 12 tháng)",
      price: "18,897,976 đ",
      numericPrice: 18897976,
    },
    {
      id: "12m-3",
      name: "Gói vắc xin Hexaxim – Rotateq – Varilrix (0 - 12 tháng)",
      price: "14,828,200 đ",
      numericPrice: 14828200,
    },
  ];

  const handleCheckboxChange = (packageId) => {
    setSelectedPackages((prev) => {
      if (prev.includes(packageId)) {
        return prev.filter((id) => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  const calculateTotal = () => {
    const allPackages = [...vaccinePackages9Months, ...vaccinePackages12Months];
    const total = allPackages
      .filter((pkg) => selectedPackages.includes(pkg.id))
      .reduce((sum, pkg) => sum + pkg.numericPrice, 0);

    return (
      new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        maximumFractionDigits: 0,
      }).format(total) + " đ"
    );
  };

  const renderPackages = (packages) => (
    <Row gutter={[16, 16]}>
      {packages.map((package_) => (
        <Col xs={24} sm={12} md={8} lg={8} key={package_.id}>
          <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" style={{ marginBottom: "16px" }}>
            <Checkbox
              className="w-full"
              checked={selectedPackages.includes(package_.id)}
              onChange={() => handleCheckboxChange(package_.id)}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex-1">
                  <div className="text-base font-medium">{package_.name}</div>
                  <div className="text-gray-500 text-sm mt-1">{package_.description}</div>
                </div>
                <div className="text-blue-600 font-medium text-right mt-2 md:mt-0">{package_.price}</div>
              </div>
            </Checkbox>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Form.Item label="Vaccination Package" className="mt-4">
        <Collapse>
          <Panel header="Vaccination / 0 - 1 year" key="1">
            {renderPackages(vaccinePackages9Months)}
          </Panel>

          <Panel header="Vaccination / 1 - 2 years" key="2">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 2 - 3 years" key="3">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 3 - 4 years" key="4">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 4 - 5 years" key="5">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 5 - 6 years" key="6">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 6 - 7 years" key="7">
            {renderPackages(vaccinePackages12Months)}
          </Panel>

          <Panel header="Vaccination / 7 - 8 years" key="8">
            {renderPackages(vaccinePackages12Months)}
          </Panel>
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
