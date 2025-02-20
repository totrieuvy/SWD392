import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Radio, Button, Card } from "antd";
import { UserOutlined, CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "./RegisterChildren.scss";
import api from "../../../../config/axios";

const RegisterChildren = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken); // For debugging

      // Extract userId - try different possible fields
      const userId = decodedToken.sub || decodedToken.userId || decodedToken.id;

      if (!userId) {
        console.error("No userId found in token:", decodedToken);
        toast.error("Unable to find user information");
        return;
      }

      // Set the decoded userId to the form
      form.setFieldValue("userId", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Error processing user information");
      navigate("/login");
    }
  }, [navigate, form, token]);

  const onFinish = async (values) => {
    try {
      // Get the userId from form
      const userId = form.getFieldValue("userId");

      if (!userId) {
        toast.error("User ID is missing. Please try logging in again.");
        navigate("/login");
        return;
      }

      const formattedData = {
        userId: userId, // Make sure this is included
        fullName: values.fullName,
        dob: values.dob.format("DD-MM-YYYY"),
        gender: values.gender,
        address: values.address,
      };

      console.log("Submitting data:", formattedData); // For debugging

      const response = await api.post("user/child", formattedData);
      console.log("Response:", response); // For debugging

      if (response.data) {
        form.resetFields();
        toast.success("Đăng ký hồ sơ trẻ thành công!");
        navigate("/register-children-success");
      }
    } catch (error) {
      console.error("Error registering child:", error);
      const errorMessage =
        error.response?.data?.errors?.UserId?.[0] || error.response?.data?.message || "Đăng ký hồ sơ trẻ thất bại!";
      toast.error(errorMessage);
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
