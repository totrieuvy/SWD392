import React, { useState } from 'react';
import { Form, Input, DatePicker, Segmented, Select, Card, Row, Col, ConfigProvider } from 'antd';

const PatientSection = () => {
  const [form] = Form.useForm();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const cities = [
    { value: 'hanoi', label: 'Ha Noi' },
    { value: 'hcm', label: 'Ho Chi Minh' }
  ];

  const districts = [
    { value: 'thuduc', label: 'Thu Duc' },
    { value: 'district1', label: 'District 1' },
    { value: 'district2', label: 'District 2' },
    { value: 'district3', label: 'District 3' },
    { value: 'district4', label: 'District 4' },
    { value: 'district5', label: 'District 5' }
  ];

  const wards = [
    { value: 'linhchieu', label: 'Linh Chieu' },
    { value: 'binhtho', label: 'Binh Tho' },
    { value: 'truongtho', label: 'Truong Tho' }
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemSelectedBg: '#65558F',
            itemSelectedColor: '#ffffff',
          },
        },
      }}
    >
      <Card title="Patient Info" className="max-w-6xl mx-auto"
         headStyle={{ 
          backgroundColor: '#65558F', 
          color: '#ffffff'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name' }]}
              >
                <Input placeholder="name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="Date of birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select your date of birth' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Segmented 
                  options={['Male', 'Female']} 
                  block 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="City/Province"
                name="city"
                rules={[{ required: true, message: 'Please select your city' }]}
              >
                <Select
                  placeholder="select"
                  options={cities}
                  onChange={(value) => setSelectedCity(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="District"
                name="district"
                rules={[{ required: true, message: 'Please select your district' }]}
              >
                <Select
                  placeholder="select"
                  options={districts}
                  onChange={(value) => setSelectedDistrict(value)}
                  disabled={!selectedCity}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="Ward"
                name="ward"
                rules={[{ required: true, message: 'Please select your ward' }]}
              >
                <Select
                  placeholder="select"
                  options={wards}
                  disabled={!selectedDistrict}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address' }]}
          >
            <Input placeholder="address" rows={4} />
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default PatientSection;