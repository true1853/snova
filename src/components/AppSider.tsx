import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  StarOutlined,
  UserOutlined,
  RobotOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
// Импортируем логотип
import logo from "../assets/logo.svg";

const { Sider } = Layout;

interface AppSiderProps {
  darkMode: boolean;
}

const AppSider: React.FC<AppSiderProps> = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: <Link to="/dashboard">Сводка</Link> },
    { key: "2", icon: <BarChartOutlined />, label: <Link to="/analytics">Аналитика</Link> },
    { key: "3", icon: <ShoppingCartOutlined />, label: <Link to="/orders">Заказы</Link> },
    { key: "4", icon: <AppstoreOutlined />, label: <Link to="/products">Товары</Link> },
    { key: "5", icon: <StarOutlined />, label: <Link to="/recommendations">Рекомендации</Link> },
    { key: "6", icon: <UserOutlined />, label: <Link to="/account">Аккаунт</Link> },
    { key: "7", icon: <RobotOutlined />, label: <Link to="/ai-help">Помощь ИИ</Link> },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 1000,
              color: darkMode ? "#fff" : "#000",
            }}
          />
          <Drawer
            placement="left"
            closable
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0 }}
            title={
              <div style={{ textAlign: "center" }}>
                <img src={logo} alt="Logo" style={{ maxWidth: "100%", height: "40px" }} />
              </div>
            }
          >
            <Menu
              theme={darkMode ? "dark" : "light"}
              mode="inline"
              items={menuItems}
              style={{ background: darkMode ? "#141414" : "#ffffff" }}
            />
          </Drawer>
        </>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            background: darkMode ? "#141414" : "#ffffff",
          }}
        >
          {/* Логотип сверху */}
          <div style={{ padding: "16px", textAlign: "center" }}>
            <img src={logo} alt="Logo" style={{ maxWidth: "100%", height: "40px" }} />
          </div>

          {/* Меню заполняет оставшееся пространство */}
          <Menu
            theme={darkMode ? "dark" : "light"}
            mode="inline"
            items={menuItems}
            style={{ flex: 1, background: darkMode ? "#141414" : "#ffffff" }}
          />

          {/* Кнопка прижата к низу */}
          <div style={{ marginTop: "auto", textAlign: "center", padding: "8px" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: darkMode ? "#ffffff" : "#000000",
                fontSize: "18px",
                background: "transparent",
              }}
            />
          </div>
        </Sider>
      )}
    </>
  );
};

export default AppSider;
