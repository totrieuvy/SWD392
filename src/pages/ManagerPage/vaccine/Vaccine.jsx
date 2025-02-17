import { Table, Tag, Input, Button, Modal, Image, Form, InputNumber, Select, Upload, Popconfirm, Col, Row } from "antd";
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
  const [isUpdate, setIsUpdate] = useState(false);

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
    document.title = "Vaccine";
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
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image src={text} alt="Vaccine" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "10px" }} />
      ),
    },
    {
      title: "Manufacturer",
      dataIndex: ["manufacturer", "name"],
      key: "manufacturer",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => formatVND(price),
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "vaccineId",
      key: "vaccineId",
      render: (vaccineId, record) => (
        <div>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={() => {
              setIsUpdate(true);
              form.setFieldsValue({
                ...record,
                manufacturerId: record.manufacturer?.manufacturerId || null,
              });

              setOpen(true);
              if (record.image) {
                setFileList([
                  {
                    name: "image.png",
                    status: "done",
                    url: record.image,
                  },
                ]);
              }
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete vaccine"
            description="Are you sure to delete this vaccine?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(vaccineId)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = async (vaccineId) => {
    try {
      await api.delete(`v1/vaccine/${vaccineId}`);
      toast.success("Delete vaccine successfully");
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
    setIsUpdate(false);
  };

  const handleSubmitForm = async (values) => {
    console.log("values", values);
    setLoading(true);

    try {
      if (values.image) {
        const url = await uploadFile(values.image.file.originFileObj);
        values.image = url;
      }

      if (values.vaccineId || isUpdate) {
        console.log("id", values.vaccineId);
        await api.put(`v1/vaccine/${values.vaccineId}`, {
          vaccineName: values.vaccineName,
          description: {
            info: values.description?.info || "",
            targetedPatient: values.description?.targetedPatient || "",
            injectionSchedule: values.description?.injectionSchedule || "",
            vaccineReaction: values.description?.vaccineReaction || "",
          },
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
        console.log("submit values", values);
        toast.success("Update vaccine sucessfully");
      } else {
        await api.post("v1/vaccine", {
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
        console.log("submit values", values);
        toast.success("Add vaccine sucessfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchData();
      handleCancel();
      form.resetFields();
      setLoading(false);
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
        title="Vaccine Form"
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} onFinish={handleSubmitForm} labelCol={{ span: 24 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="vaccineId" label="vaccineId" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="vaccineName"
                label="Vaccine Name"
                rules={[{ required: true, message: "Please enter vaccine name" }]}
              >
                <Input placeholder="Enter vaccine name" />
              </Form.Item>

              <Form.Item
                name={["description", "info"]}
                label="Information"
                rules={[{ required: true, message: "Please enter information" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["description", "targetedPatient"]}
                label="Targeted Patients"
                rules={[{ required: true, message: "Please enter targeted patients" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["description", "injectionSchedule"]}
                label="Injection Schedule"
                rules={[{ required: true, message: "Please enter injection schedule" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="manufacturerId"
                label="Manufacturer"
                rules={[{ required: true, message: "Please select manufacturer" }]}
              >
                <Select disabled={isUpdate}>
                  {manufacturers.map((m) => (
                    <Select.Option key={m.manufacturerId} value={m.manufacturerId}>
                      {m.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="price" label="Price" rules={[{ required: true, message: "Enter price" }]}>
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter price" />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                name={["description", "vaccineReaction"]}
                label="Vaccine Reaction"
                rules={[{ required: true, message: "Please enter vaccine reactions" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="minAge"
                label="Minimum Age"
                rules={[{ required: true, message: "Please enter minimum age" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter minimum age" />
              </Form.Item>

              <Form.Item
                name="maxAge"
                label="Maximum Age"
                rules={[{ required: true, message: "Please enter maximum age" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter maximum age" />
              </Form.Item>

              <Form.Item
                name="numberDose"
                label="Number of Doses"
                rules={[{ required: true, message: "Please enter number of doses" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} placeholder="Enter number of doses" />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Duration (days)"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter duration" />
              </Form.Item>

              <Form.Item name="unit" label="Unit" rules={[{ required: true, message: "Please enter unit" }]}>
                <Input placeholder="Enter unit" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Image" name="image" rules={[{ required: true, message: "Please upload image" }]}>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default Vaccine;
