import React, { useState } from 'react';
import { Form, Card, Row, Col, Checkbox, Collapse } from 'antd';
const { Panel } = Collapse;

const SingleVaccinationSection = () => {
  const [selectedVaccine, setSelectedVaccine] = useState([]);

  const vaccine = [
    {
      id: 1,
      name: "Vắc xin Hexaxim",
      price: "3,434,900 đ",
      numericPrice: 13434900
    },
    {
      id: 2,
      name: "Vắc xin Rotarix",
      price: "2,897,976 đ",
      numericPrice: 17897976
    },
    {
      id: 3,
      name: "Vắc xin Varilrix",
      price: "1,828,200 đ",
      numericPrice: 13828200
    }
  ];

  const handleCheckboxChange = (packageId) => {
    setSelectedVaccine(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  const calculateTotal = () => {
    const total = vaccine
      .filter(pkg => selectedVaccine.includes(pkg.id))
      .reduce((sum, pkg) => sum + pkg.numericPrice, 0);
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(total) + ' đ';
  };

  return (
    <>
      <Form.Item label="Single Vaccination" className="mt-4">
        <Collapse>
          <Panel header="Select vaccines" key="1">
            <Row gutter={[16, 16]}>
              {vaccine.map((package_) => (
                <Col xs={24} sm={12} md={8} lg={8} key={package_.id}>
                  <Card 
                    className="w-full cursor-pointer hover:shadow-md transition-shadow"
                    style={{ marginBottom: '16px' }}
                  >
                    <Checkbox 
                      className="w-full"
                      checked={selectedVaccine.includes(package_.id)}
                      onChange={() => handleCheckboxChange(package_.id)}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="flex-1">
                          <div className="text-base font-medium">
                            {package_.name}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">
                            {package_.description}
                          </div>
                        </div>
                        <div className="text-blue-600 font-medium text-right mt-2 md:mt-0">
                          {package_.price}
                        </div>
                      </div>
                    </Checkbox>
                  </Card>
                </Col>
              ))}
            </Row>
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

export default SingleVaccinationSection;