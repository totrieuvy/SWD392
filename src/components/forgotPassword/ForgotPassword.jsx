import { Button, Form, Input } from "antd";
import Authentication from "../authentication/Authentication";
import { useForm } from "antd/es/form/Form";
import "./ForgotPassword.scss";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [form] = useForm();
  return (
    <Authentication>
      <div className="container">
        <div className="ForgotPassword">
          <h2 className="ForgotPassword__title">Forgot Your Password?</h2>
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
              <Input className="ForgotPassword__input" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="ForgotPassword__button">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <div className="ForgotPassword__middle">
            <Link to="/login" className="ForgotPassword__back-login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Authentication>
  );
}

export default ForgotPassword;
