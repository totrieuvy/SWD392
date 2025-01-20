import React, { useState, useEffect } from "react";
import { ConfigProvider, Button, Menu, Drawer } from "antd";
import { 
  CalendarOutlined, 
  MenuOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about-us">About Us</Link>,
    },
    {
      key: 'vaccination',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/vaccination">Vaccination</Link>,
    },
    {
      key: 'pricing',
      icon: <DollarOutlined />,
      label: <Link to="/pricing">Pricing</Link>,
    },
    {
      key: 'register',
      icon: <CalendarOutlined />,
      label: <Link to="/register">Register Schedule</Link>,
    },
  ];

  return (
    <div className="HomePage-Header-wrapper">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#9989C5",
          },
          components: {
            Menu: {
              horizontalItemBorderWidth: 0, // Remove bottom border of menu items
            }
          }
        }}
      >
        <header className="HomePage-Header">
          <div className="HomePage-Header-container">
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setShowDrawer(true)}
                className="HomePage-Header-menu-button"
              />
            )}
            
            <Link to="/" className="HomePage-Header-logo-link">
              <div className="HomePage-Header-logo-container">
                <img
                  src="src/assets/HomePage/VaccineLogo.jpg"
                  alt="Logo"
                  className="HomePage-Header-logo-image"
                />
              </div>
              <h1 className="HomePage-Header-title">
                Vaccine Care
              </h1>
            </Link>

            {isMobile && (
              <Link to="/login">
                <Button type="primary">Sign In</Button>
              </Link>
            )}
          </div>
        </header>

        {/* Submenu for desktop */}
        {!isMobile && (
          <div className="HomePage-Header-submenu-container">
            <div className="HomePage-Header-submenu-wrapper">
              <Menu
                mode="horizontal"
                className="HomePage-Header-desktop-menu"
                items={menuItems}
              />
              <Link to="/login">
                <Button type="primary" className="HomePage-Header-signin-button">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Sidebar drawer for mobile */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
          width={280}
        >
          <Menu
            mode="vertical"
            className="HomePage-Header-menu HomePage-Header-mobile-menu"
            items={menuItems}
            onClick={() => setShowDrawer(false)}
          />
        </Drawer>
      </ConfigProvider>
    </div>
  );
};

export default Header;