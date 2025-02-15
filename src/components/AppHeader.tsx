import React, { useState, useEffect } from "react";
import { Layout, Badge, Avatar, Dropdown } from "antd";
import {
  QuestionCircleOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "account", label: "Финансы", onClick: () => navigate("/account") },
    { key: "logout", label: "Выйти", onClick: () => navigate("/auth") },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "10px 20px",
        background: "#001529",
        color: "white",
        width: "100%",
        maxWidth: "var(--appsider-width)",
        margin: "0 auto",
      }}
    >
      {/* Логотип убран */}

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <SearchOutlined
          style={{ fontSize: "20px", cursor: "pointer"}}
        />
        {!isMobile && (
          <QuestionCircleOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        )}

        {/* Счётчик уведомлений (Badge) в зелёном цвете */}
        <Badge count={5} color="#52c41a">
          <BellOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        </Badge>

        {/* Аватар, также в зелёном стиле */}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Avatar
            icon={<UserOutlined style={{ color: "#fff" }} />}
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
