import React, { useState } from "react";
import { Layout, Card, Input, Button, Typography, Tabs, ConfigProvider, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import "../styles/auth.css";

const { Text } = Typography;
const { Content } = Layout;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [darkMode] = useState(true);

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      setError("Введите имя пользователя и пароль");
      return;
    }
    navigate("/dashboard");
  };

  const handleRegister = async (): Promise<void> => {
    if (!username || !email || !password) {
      setError("Введите все поля для регистрации");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#52c41a", // Polar Green
          borderRadius: 8,
          colorBgLayout: darkMode ? "#141414" : "#f0f2f5",
          colorBgContainer: darkMode ? "#1f1f1f" : "white",
          colorText: darkMode ? "white" : "black",
        },
      }}
    >
      <Layout className={darkMode ? "auth-container dark-mode" : "auth-container"} style={{ background: darkMode ? "#141414" : "#f0f2f5" }}>
        <Content className="auth-content">
          <img src="https://snova.pro/img/logo.svg" alt="Logo" className="auth-logo" />
          <Card className="auth-card" bordered={false}>
            <Tabs defaultActiveKey="login" activeKey={activeTab} onChange={(key) => setActiveTab(key as "login" | "register")} centered>
              <Tabs.TabPane tab="Вход" key="login">
                <Text className="auth-title"> Вход в систему</Text>
                <p className="auth-subtitle">Введите учетные данные для доступа</p>
                <Input prefix={<UserOutlined className="auth-icon" />} placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" style={{ background: darkMode ? "#333" : "white", color: darkMode ? "white" : "black" }} />
                <Input.Password prefix={<LockOutlined className="auth-icon" />} placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" style={{ background: darkMode ? "#333" : "white", color: darkMode ? "white" : "black" }} />
                {error && <Text type="danger">{error}</Text>}
                <Button type="primary" block onClick={handleLogin} className="auth-button">
                  Войти
                </Button>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Регистрация" key="register">
                <Text className="auth-title">Регистрация</Text>
                <p className="auth-subtitle">Создайте новый аккаунт</p>
                <Input prefix={<UserOutlined className="auth-icon" />} placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" style={{ background: darkMode ? "#333" : "white", color: darkMode ? "white" : "black" }} />
                <Input prefix={<MailOutlined className="auth-icon" />} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" style={{ background: darkMode ? "#333" : "white", color: darkMode ? "white" : "black" }} />
                <Input.Password prefix={<LockOutlined className="auth-icon" />} placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" style={{ background: darkMode ? "#333" : "white", color: darkMode ? "white" : "black" }} />
                {error && <Text type="danger">{error}</Text>}
                <Button type="primary" block onClick={handleRegister} className="auth-button">
                  Зарегистрироваться
                </Button>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Auth;
