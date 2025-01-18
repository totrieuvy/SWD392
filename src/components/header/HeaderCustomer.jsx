import React from "react";
import { ConfigProvider, Button, Menu } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const Header = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#9989C5", // Custom primary color
        },
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          padding: "0 20px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="src\assets\HomePage\VaccineLogo.jpg"
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h1
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Vaccine Care
          </h1>
        </div>

        {/* Navigation Section */}
        <Menu
          mode="horizontal"
          style={{
            borderBottom: "none",
            background: "transparent",
            flexGrow: 1,
          }}
        >
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="about">About Us</Menu.Item>
          <Menu.Item key="vaccination">Vaccination</Menu.Item>
          <Menu.Item key="pricing">Pricing</Menu.Item>
          <Menu.Item key="register" icon={<CalendarOutlined />}>
            Register Schedule
          </Menu.Item>
        </Menu>

        {/* Sign In Button */}
        <Button type="primary" style={{ marginLeft: "20px" }}>
          Sign In
        </Button>
      </header>
    </ConfigProvider>
  );
};

export default Header;
