import React, { useState, createContext, useContext, useEffect } from "react";
import { Layout, ConfigProvider, theme, Breadcrumb } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import AppSider from "../components/AppSider";
import AppHeader from "../components/AppHeader";
import AuthProvider from "../context/AuthProvider";
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

  useEffect(() => {
    console.log("📍 Текущий путь:", location.pathname);
  }, [location]);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#52c41a",
            },
          }}
        >
          <Layout 
            className={darkMode ? "dark-mode" : ""} 
            style={{
              minHeight: "100vh",
              background: darkMode ? "#141414" : "#ffffff",
            }}>
            <AppSider darkMode={darkMode} />
            <Layout>
              <AppHeader />
              <Content style={{ margin: "16px", padding: "24px", background: "transparent" }}>
                <div style={{ marginBottom: 16 }}>
                  <Breadcrumb
                    items={[
                      { title: <a href="/dashboard"><HomeOutlined /></a> },
                      { title: breadcrumbNameMap[location.pathname] || "Страница" }
                    ]}
                  />
                </div>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
};

export default MainLayout;
