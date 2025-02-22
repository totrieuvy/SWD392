import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Radio, Button, Card } from "antd";
import { UserOutlined, CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "./RegisterChildren.scss";
import api from "../../../../config/axios";
import { useSelector } from "react-redux";

const RegisterChildren = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onFinish = async (values) => {
    try {
      const formattedData = {
        userId: user.userId,
        fullName: values.fullName,
        dob: values.dob.format("DD-MM-YYYY"),
        gender: values.gender,
        address: values.address,
      };

      const response = await api.post("user/child", formattedData);

      if (response.data) {
        form.resetFields();
        toast.success("Đăng ký hồ sơ trẻ thành công!");
      }
    } catch (error) {
      console.error("Error registering child:", error);
    }
  };

  return (
    <div className="RegisterChildren">
      <div className="max-w-md w-full mx-auto">
        <Card>
          <div className="title">
            <h1>Đăng kí hồ sơ trẻ em</h1>
            <h3>Hãy điền thông tin trẻ vào form bên dưới</h3>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              gender: "Male",
            }}
          >
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Hãy nhập đầy đủ họ và tên trẻ em!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên trẻ em" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: "Hãy nhập đầy đủ ngày sinh của trẻ em!" }]}
            >
              <DatePicker
                className="w-full"
                format="DD-MM-YYYY"
                prefix={<CalendarOutlined />}
                placeholder="Chọn ngày sinh"
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Hãy nhập đầy đủ giới tính của trẻ!" }]}
            >
              <Radio.Group>
                <Radio.Button value="Male">Nam</Radio.Button>
                <Radio.Button value="Female">Nữ</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Hãy nhập đầy đủ địa chỉ!" }]}>
              <Input.TextArea prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Đăng kí hồ sơ trẻ em
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterChildren;
