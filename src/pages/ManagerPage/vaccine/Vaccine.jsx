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
import "jspdf-autotable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  console.error("Không thể tải vfs_fonts. Kiểm tra lại import.");
}

// Tùy chọn: Thêm font tiếng Việt
pdfMake.fonts = {
  Roboto: {
    normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

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
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

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
        <div style={{ display: "flex", gap: "5px" }}>
          <Button color="cyan" variant="solid" onClick={() => handleDetail(record)}>
            Detail
          </Button>
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
    setFileList([]);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true);

    try {
      if (values.image) {
        if (values.image.file && values.image.file.originFileObj) {
          const url = await uploadFile(values.image.file.originFileObj);
          values.image = url;
        }
      }

      if (values.vaccineId || isUpdate) {
        console.log("id", values.vaccineId);
        await api.put(`v1/vaccine/${values.vaccineId}`, {
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

  const handleDetail = (record) => {
    setSelectedVaccine(record);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedVaccine(null);
  };

  const exportPDF = () => {
    const docDefinition = {
      content: [
        { text: "Danh sách vaccine", style: "header" },
        { text: `Ngày xuất: ${new Date().toLocaleDateString()}`, style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "auto", "auto", "auto", "*"],
            body: [
              ["Tên Vaccine", "Nhà sản xuất", "Giá", "Tuổi tối thiểu", "Tuổi tối đa", "Số liều", "Trạng thái"],
              ...filteredData.map((item) => [
                item.vaccineName,
                item.manufacturer?.name || "",
                formatVND(item.price),
                item.minAge.toString(),
                item.maxAge.toString(),
                item.numberDose.toString(),
                item.isActive ? "Đang hoạt động" : "Không hoạt động",
              ]),
            ],
          },
        },
        { text: `Tổng số vaccine: ${filteredData.length}`, style: "summary" },
        { text: `Vaccine đang hoạt động: ${filteredData.filter((item) => item.isActive).length}`, style: "summary" },
        { text: `Vaccine không hoạt động: ${filteredData.filter((item) => !item.isActive).length}`, style: "summary" },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          margin: [0, 0, 0, 20],
        },
        summary: {
          fontSize: 12,
          margin: [0, 10, 0, 0],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    try {
      pdfMake.createPdf(docDefinition).download("danh-sach-vaccine.pdf");
      toast.success("Xuất PDF thành công");
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      toast.error("Có lỗi khi xuất PDF");
    }
  };

  return (
    <div className="Vaccine">
      <h1>Danh sách vaccines</h1>

      <div className="Vaccine__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Nhập tên vaccine"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <div>
          <Button color="purple" variant="solid" onClick={exportPDF}>
            Xuất file pdf
          </Button>
          <Button type="primary" onClick={handleOpenModal}>
            Thêm mới vaccine
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" scroll={{ x: "max-content", y: 400 }} />
      <Modal
        open={open}
        title="Vaccine"
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
                rules={[
                  { required: true, message: "Please enter minimum age" },
                  { type: "number", min: 0, message: "Minimum age must be greater or equal 0" },
                  { type: "number", max: 8, message: "Minimum age must be less than 9" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Enter minimum age" />
              </Form.Item>

              <Form.Item
                name="maxAge"
                label="Maximum Age"
                rules={[
                  { required: true, message: "Please enter maximum age" },
                  { type: "number", min: 1, message: "Maximum age must be greater than 0" },
                  { type: "number", max: 8, message: "Maximum age must be less than 9" },
                ]}
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

              <Form.Item
                name="unit"
                label="Unit"
                rules={[{ required: true, message: "Please enter unit" }]}
                initialValue="year"
              >
                <Input placeholder="Enter unit" disabled />
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

      {/* Modal Detail */}
      <Modal open={detailOpen} title="Vaccine Details" onCancel={handleCloseDetail} footer={null}>
        {selectedVaccine && (
          <div>
            <p>
              <strong>Name:</strong> {selectedVaccine.vaccineName}
            </p>
            <p>
              <strong>Manufacturer:</strong> {selectedVaccine.manufacturer?.name}
            </p>
            <p>
              <strong>Price:</strong> {formatVND(selectedVaccine.price)}
            </p>
            <p>
              <strong>Active:</strong> {selectedVaccine.isActive ? "Yes" : "No"}
            </p>
            <p>
              <strong>Info:</strong> {selectedVaccine.description?.info}
            </p>
            <p>
              <strong>Targeted Patients:</strong> {selectedVaccine.description?.targetedPatient}
            </p>
            <p>
              <strong>Injection Schedule:</strong> {selectedVaccine.description?.injectionSchedule}
            </p>
            <p>
              <strong>Vaccine Reaction:</strong> {selectedVaccine.description?.vaccineReaction}
            </p>
            <p>
              <strong>Min Age:</strong> {selectedVaccine.minAge}
            </p>
            <p>
              <strong>Max Age:</strong> {selectedVaccine.maxAge}
            </p>
            <p>
              <strong>Number of Doses:</strong> {selectedVaccine.numberDose}
            </p>
            <p>
              <strong>Duration:</strong> {selectedVaccine.duration} days
            </p>
            <p>
              <strong>Unit:</strong> {selectedVaccine.unit}
            </p>
            <Image src={selectedVaccine.image} alt="Vaccine" style={{ width: "100px" }} />
          </div>
        )}
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
