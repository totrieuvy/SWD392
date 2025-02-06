import { Button, DatePicker, Form, Input, Modal, Radio, Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./Staff.scss";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

function Staff() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    document.title = "Staff";
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("v1/staff");
      const sortedData = response.data.data.sort((a, b) => b.status - a.status);
      setDataSource(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = dataSource.filter((item) => item.fullName.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (status === "Active" ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>),
    },
  ];

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Chuyển đổi định dạng ngày sinh
      const formattedValues = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
        status: "Active", // Mặc định là Active
      };

      setLoading(true);
      await api.post("v1/staff", formattedValues);
      toast.success("add staff successful");
      setLoading(false);
      setOpen(false);
      form.resetFields();
      fetchData(); // Gọi lại danh sách sau khi thêm
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <div className="Staff">
      <h1>List of staffs</h1>

      <div className="Staff__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by staff Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div>
          <Button type="primary" onClick={handleOpenModal}>
            Add new staff
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" scroll={{ x: "max-content", y: 400 }} />
      <Modal
        open={open}
        title="Add new staff"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleOk}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please input your name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please input your phone!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please input your address!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: "Please input your dob!" }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Gender" rules={[{ required: true, message: "Please input your dob!" }]}>
            <Radio.Group name="gender">
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Blood Type" rules={[{ required: true, message: "Please input your dob!" }]}>
            <Select name="bloodType">
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="AB">AB</Select.Option>
              <Select.Option value="O">O</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Staff;
