import { Button, Form, Input } from "antd";
import Authentication from "../authentication/Authentication";
import { useForm } from "antd/es/form/Form";
import "./Register.scss";
import { Link } from "react-router-dom";

function Register() {
  const [form] = useForm();
  return (
    <Authentication>
      <div className="container">
        <div className="Register">
          <h2 className="Register__title">Create Your Account</h2>
          <Form form={form} labelCol={{ span: 24 }}>
            <Form.Item
              label="Email"
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
              <Input className="Register__input" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password cannot be blank!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("The two passwords do not match!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="Register__button">
                Register
              </Button>
            </Form.Item>
          </Form>
          <div className="Register__middle">
            <Link to="/login" className="Register__back-login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Authentication>
  );
}

export default Register;
