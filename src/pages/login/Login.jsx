import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import "./Login.scss";
import { Link } from "react-router-dom";
import Authentication from "../../components/authentication/Authentication";

function Login() {
  const [form] = useForm();
  return (
    <Authentication>
      <div className="containerer">
        <div className="Login">
          <h2 className="Login__title">Welcome back</h2>
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
              <Input className="Login__input" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
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
              <Button type="primary" htmlType="submit" className="Login__button">
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
