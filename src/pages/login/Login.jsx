import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import Authentication from "../../components/authentication/Authentication";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

function Login() {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("user/login", {
        email: values.email,
        password: values.password,
      });
      console.log(response);

      if (response && response.data) {
        const { token, roleName } = response.data.data;
        toast.success(response.data.message);

        localStorage.setItem("token", token);
        dispatch(login(response.data.data));

        if (roleName == "user") {
          navigate("/");
        } else if (roleName == "admin") {
          navigate("/admin");
        } else if (roleName == "manager") {
          navigate("/manager");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Authentication>
      <div className="containerer">
        <div className="Login">
          <h2 className="Login__title">Welcome back</h2>
          <Form form={form} labelCol={{ span: 24 }} onFinish={handleFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter a valid email address!",
                },
                {
                  required: true,
                  message: "Email cannot be blank!",
                },
              ]}
            >
              <Input className="Login__input" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Email cannot be blank!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="Login__button" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
          <div className="Login__middle">
            <Link to="/forgot-password" className="Login__forgot-password">
              Forgot password?
            </Link>
            <div>
              Do not have an account?{" "}
              <Link to="/register" className="Login__register">
                Register
              </Link>
            </div>
          </div>
          <div className="Login__footer">
            <div className="Login__footer__or">Or</div>
            <div className="Login__footer__google">
              <Button type="primary" className="Login__footer__google-button">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                  alt="google"
                  width={100}
                />
                Login with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Authentication>
  );
}

export default Login;
