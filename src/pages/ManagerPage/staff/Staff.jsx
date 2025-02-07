import { Button, DatePicker, Form, Input, Modal, Popconfirm, Radio, Select, Table, Tag } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../config/axios";
import "./Staff.scss";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

function Staff() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = useForm();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    document.title = "Staff";
  }, []);

  const handleViewDetail = (staffId) => {
    const staff = dataSource.find((item) => item.staffId === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setDetailOpen(true);
    }
  };

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
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      sorter: (a, b) => a.dob.localeCompare(b.dob),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Blood Type",
      dataIndex: "bloodType",
      key: "bloodType",
      sorter: (a, b) => a.bloodType.localeCompare(b.bloodType),
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
    {
      title: "Action",
      dataIndex: "staffId",
      key: "staffId",
      render: (staffId, record) => (
        <div className="Staff__action">
          <Button
            type="link"
            icon={<EyeOutlined style={{ fontSize: "20px" }} />}
            onClick={() => handleViewDetail(staffId)}
          />
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setOpen(true);
              setIsUpdate(true);

              form.setFieldsValue({
                ...record,
                dob: record.dob ? dayjs(record.dob, "DD-MM-YYYY") : null,
              });
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete staff"
            description="Are you sure to delete this staff?"
            onConfirm={() => handleDelete(staffId)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = async (staffId) => {
    try {
      await api.delete(`v1/staff/${staffId}`);
      toast.success("Delete staff successful");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    form.resetFields();
    setOpen(true);
  };

  const handleOk = async (values) => {
    setLoading(true);
    try {
      if (values.staffId) {
        await api.put(`v1/staff/${values.staffId}`, values);
        toast.success("Update staff successful");
      } else {
        const values = await form.validateFields();

        // Chuyển đổi định dạng ngày sinh
        const formattedValues = {
          ...values,
          dob: values.dob.format("DD-MM-YYYY"),
        };

        setLoading(true);
        await api.post("v1/staff", formattedValues);
        toast.success("add staff successful");
        setLoading(false);
        setOpen(false);
        form.resetFields();
        fetchData();
      }
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
        title={`${isUpdate ? "Update" : "Add"} staff`}
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
          <Form.Item label="staffId" name="staffId" hidden>
            <Input />
          </Form.Item>
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

      <Modal open={detailOpen} title="Staff Details" onCancel={() => setDetailOpen(false)} footer={null}>
        {selectedStaff && (
          <div>
            <p>
              <strong>Name:</strong> {selectedStaff.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedStaff.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedStaff.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedStaff.address}
            </p>
            <p>
              <strong>Role:</strong> {selectedStaff.role}
            </p>
            <p>
              <strong>Status:</strong> {selectedStaff.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Staff;
