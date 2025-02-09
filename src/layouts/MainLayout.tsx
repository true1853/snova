import React, { useState, createContext, useContext } from "react";
import { Layout, ConfigProvider, theme, Breadcrumb } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import AppSider from "../components/AppSider";
import AppHeader from "../components/AppHeader";
import "antd/dist/reset.css";
import "../styles.css";

const { Content } = Layout;

const breadcrumbNameMap: Record<string, string> = {
    "/dashboard": "Сводка",
    "/analytics": "Аналитика",
    "/orders": "Заказы",
    "/products": "Товары",
    "/recommendations": "Рекомендации",
    "/account": "Аккаунт",
    "/ai-help": "Помощь ИИ",
};

const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);

const MainLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#52c41a", // Polar Green
          },
        }}
      >
        <Layout className={darkMode ? "dark-mode" : ""} 
          style={{
            minHeight: "100vh",
            background: darkMode ? "#141414" : "#ffffff",
          }}>
          <AppHeader />
          <Layout>
            <AppSider />
            <Content style={{ margin: "16px", padding: "24px", background: "transparent" }}>
              <div style={{ marginBottom: 16 }}>
                <Breadcrumb>
                  <Breadcrumb.Item href="/dashboard">
                    <HomeOutlined />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{breadcrumbNameMap[location.pathname] || "Страница"}</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default MainLayout;
