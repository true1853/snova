import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";
import "../styles.css";

const { Content } = Layout;

const AuthLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <Content style={{ width: 400, textAlign: "center" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
