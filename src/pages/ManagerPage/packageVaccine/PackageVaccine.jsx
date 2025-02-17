import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Button, Input, Modal, Table, Tag } from "antd";
import { formatVND } from "../../../utils/currencyFormat";
import { SearchOutlined } from "@ant-design/icons";

function PackageVaccine() {
  const [packageVaccine, setPackageVaccine] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => formatVND(price),
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Tuổi Tối Thiểu",
      dataIndex: "minAge",
      key: "minAge",
      render: (minAge) => (minAge !== null ? minAge : "N/A"),
    },
    {
      title: "Tuổi Tối Đa",
      dataIndex: "maxAge",
      key: "maxAge",
      render: (maxAge) => (maxAge !== null ? maxAge : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Hành động",
      dataIndex: "packageId",
      key: "packageId",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Button type="default" onClick={() => showDetail(record)}>
            Detail
          </Button>
          <Button type="primary">Edit</Button>
          <Button type="primary" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await api.get("/v1/package");
      const sortedData = response.data.data.sort((a, b) => Number(b.isActive) - Number(a.isActive));
      setPackageVaccine(sortedData);
      setFilteredPackages(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  const showDetail = (packageData) => {
    setSelectedPackage(packageData);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    const filtered = packageVaccine.filter((pkg) => pkg.packageName.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredPackages(filtered);
  };

  useEffect(() => {
    fetchData();
    document.title = "Package Vaccine";
  }, []);

  return (
    <div className="PackageVaccine">
      <div className="Vaccine__above">
        <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
          <Input
            placeholder="Search by Package Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div>
          <Button type="primary">Add new vaccine</Button>
        </div>
      </div>

      <Table dataSource={filteredPackages} columns={columns} rowKey="packageId" />

      <Modal
        title="Chi tiết gói vaccine"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedPackage ? (
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, lineHeight: "2.5", paddingRight: "20px" }}>
              <p>
                <strong>Tên gói:</strong> {selectedPackage.packageName}
              </p>
              <p>
                <strong>Mô tả:</strong> {selectedPackage.description}
              </p>
              <p>
                <strong>Giá:</strong> {formatVND(selectedPackage.price)}
              </p>
              <p>
                <strong>Giảm giá:</strong> {selectedPackage.discount}%
              </p>
              <p>
                <strong>Tuổi tối thiểu:</strong> {selectedPackage.minAge ?? "N/A"}
              </p>
              <p>
                <strong>Tuổi tối đa:</strong> {selectedPackage.maxAge ?? "N/A"}
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <Tag color={selectedPackage.isActive ? "green" : "red"}>
                  {selectedPackage.isActive ? "Active" : "Inactive"}
                </Tag>
              </p>
            </div>
            <div style={{ flex: 1, maxHeight: "400px", overflowY: "auto" }}>
              <h3>Danh sách Vaccine:</h3>
              {selectedPackage.vaccines && selectedPackage.vaccines.length > 0 ? (
                <ul style={{ padding: 0 }}>
                  {selectedPackage.vaccines.map((vaccine) => (
                    <li
                      key={vaccine.vaccineId}
                      style={{
                        border: "1px solid #d9d9d9", // Thêm viền
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "4px", // Bo góc cho đẹp
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Thêm bóng nhẹ cho phần tử
                      }}
                    >
                      <p>
                        <strong>Tên Vaccine:</strong> {vaccine.vaccineName}
                      </p>
                      <p>
                        <strong>Nhà sản xuất:</strong> {vaccine.manufacturer.name} ({vaccine.manufacturer.countryName})
                      </p>
                      <p>
                        <strong>Lịch tiêm:</strong> {vaccine.description.injectionSchedule}
                      </p>
                      <p>
                        <strong>Phản ứng:</strong> {vaccine.description.vaccineReaction}
                      </p>
                      <img src={vaccine.image} alt={vaccine.vaccineName} style={{ width: "100px" }} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có vaccine nào trong gói này.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu.</p>
        )}
      </Modal>
    </div>
  );
}

export default PackageVaccine;
