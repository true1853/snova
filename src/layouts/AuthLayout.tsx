import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";
import "../styles.css";

const { Content } = Layout;

const AuthLayout: React.FC = () => {
  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
