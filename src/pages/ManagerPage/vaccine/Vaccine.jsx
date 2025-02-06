import { Table, Tag, Input, Button, Modal, Image, Form, InputNumber, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import "./Vaccine.scss";
import { formatVND } from "../../../utils/currencyFormat";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/upload";
import { toast } from "react-toastify";

function Vaccine() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    document.title = "Vaccine";
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("v1/vaccine");
      console.log(response.data.data);
      const listmanufacturers = await api.get("v1/manufacturer");
      setManufacturers(listmanufacturers.data.data);
      const sortedData = response.data.data.sort((a, b) => b.isActive - a.isActive);
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
    const filtered = dataSource.filter((item) => item.vaccineName.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  };

  // Cột bảng
  const columns = [
    {
      title: "Vaccine Name",
      dataIndex: "vaccineName",
      key: "vaccineName",
      sorter: (a, b) => a.vaccineName.localeCompare(b.vaccineName),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (text) => (text.length > 20 ? `${text.substring(0, 20)}...` : text),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => formatVND(price),
    },
    {
      title: "Min Age",
      dataIndex: "minAge",
      key: "minAge",
      sorter: (a, b) => a.minAge - b.minAge,
    },
    {
      title: "Max Age",
      dataIndex: "maxAge",
      key: "maxAge",
      sorter: (a, b) => a.maxAge - b.maxAge,
    },
    {
      title: "Number dose",
      dataIndex: "numberDose",
      key: "numberDose",
      sorter: (a, b) => a.maxAge - b.maxAge,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.maxAge - b.maxAge,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      sorter: (a, b) => a.maxAge - b.maxAge,
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
      sorter: (a, b) => a.manufacturerName.localeCompare(b.manufacturerName),
    },

    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} alt="vaccine" style={{ width: 60, height: 60, borderRadius: "10px" }} />,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      defaultSortOrder: "descend", // Mặc định sort giảm dần (Active trước)
      sorter: (a, b) => a.isActive - b.isActive,
      render: (isActive) => (isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
    },
  ];

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleSubmitForm = async (values) => {
    console.log(values);
    setLoading(true);

    try {
      // if (values.image) {
      //   const url = await uploadFile(values.image.file.originFileObj);
      //   values.image = url;
      // }

      const response = await api.post("v1/vaccine", {
        vaccineName: values.vaccineName,
        description: values.description,
        minAge: values.minAge,
        maxAge: values.maxAge,
        numberDose: values.numberDose,
        duration: values.duration,
        unit: values.unit,
        image: values.image,
        manufacturerId: values.manufacturerId,
        price: values.price,
        isActive: true,
      });
      toast.success("Add vaccine sucessfully");
      handleCancel();
      fetchData();
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Vaccine">
      <h1>List of vaccines</h1>

      <div className="Vaccine__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by Vaccine Name"
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
            Add new vaccine
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" scroll={{ x: "max-content", y: 400 }} />
      <Modal
        open={open}
        title="Add new vaccine"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <Form.Item
            label="Vaccine Name"
            name="vaccineName"
            rules={[{ required: true, message: "Please enter the vaccine name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Minimum Age"
            name="minAge"
            rules={[{ required: true, type: "number", message: "Please enter minimum age" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Maximum Age"
            name="maxAge"
            rules={[{ required: true, type: "number", message: "Please enter maximum age" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Number of Doses"
            name="numberDose"
            rules={[{ required: true, type: "number", message: "Please enter number of doses" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, type: "number", message: "Please enter duration" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label="Unit" name="unit" rules={[{ required: true, message: "Please enter the unit" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Image" name="image" rules={[{ required: true, message: "Please upload image" }]}>
            {/* <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload> */}
            <Input />
          </Form.Item>

          <Form.Item
            label="Manufacturer"
            name="manufacturerId"
            rules={[{ required: true, message: "Please select manufacturer" }]}
          >
            <Select placeholder="Select manufacturer">
              {manufacturers.map((manufacturer) => (
                <Select.Option key={manufacturer.manufacturerId} value={manufacturer.manufacturerId}>
                  {manufacturer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, type: "number", message: "Please enter the price" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Vaccine;
