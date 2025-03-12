import React, { useState } from "react";
import { Layout, Card, Input, Button, Typography, Tabs, ConfigProvider, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import "../styles/auth.css";
import logo from "../assets/logo.svg";

const { Text } = Typography;
const { Content } = Layout;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [darkMode] = useState(true);

  // URL GraphQL-сервера
  const GRAPHQL_URL = "/graphql";

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setError("Введите email и пароль");
      return;
    }
    try {
      const query = `
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            token
            user {
              id
              name
            }
          }
        }
      `;
      const response = await axios.post(
        GRAPHQL_URL,
        {
          query,
          variables: { email, password },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token, user } = response.data.data?.loginUser || {};
      if (!token || !user?.id) {
        throw new Error("Некорректный ответ сервера");
      }
      // Сохраняем токен и userId (приводим к строке, если нужно)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(user.id));
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка входа. Проверьте учетные данные.");
    }
  };
  

  const handleRegister = async (): Promise<void> => {
    if (!email || !password) {
      setError("Введите все поля для регистрации");
      return;
    }
    try {
      const registerQuery = `
        mutation CreateUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
            created_at
          }
        }
      `;
      const variables = { name: email, email, password };
      await axios.post(
        GRAPHQL_URL,
        { query: registerQuery, variables },
        { headers: { "Content-Type": "application/json" } }
      );
      // Если сервер не возвращает токен сразу после регистрации, выполняем вход
      const loginQuery = `
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            token
            user {
              id
            }
          }
        }
      `;
      const tokenResponse = await axios.post(
        GRAPHQL_URL,
        { query: loginQuery, variables: { email, password } },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token, user } = tokenResponse.data.data?.loginUser || {};
      if (!token || !user?.id) {
        throw new Error("Регистрация прошла успешно, но токен не получен");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте другой email.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#52c41a",
          borderRadius: 8,
          colorBgLayout: darkMode ? "#141414" : "#f0f2f5",
          colorBgContainer: darkMode ? "#1f1f1f" : "white",
          colorText: darkMode ? "white" : "black",
        },
      }}
    >
      <Layout
        className={darkMode ? "auth-container dark-mode" : "auth-container"}
        style={{
          background: darkMode ? "#141414" : "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Content
          className="auth-content"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px" }}
        >
          <img src={logo} alt="Logo" style={{ maxWidth: "100%", height: "40px", marginBottom: "10px" }} />
          <Text style={{ marginBottom: "20px", textAlign: "center" }}>
            Платформа для повышения эффективности вашего бизнеса на маркетплейсах
          </Text>
          <Card className="auth-card" bordered={false} style={{ width: "100%" }}>
            <Tabs defaultActiveKey="login" activeKey={activeTab} onChange={(key) => setActiveTab(key as "login" | "register")} centered>
              <Tabs.TabPane tab="Вход" key="login">
                <Text className="auth-title">Вход в систему</Text>
                <p className="auth-subtitle">Введите учетные данные для доступа</p>
                <Input
                  prefix={<MailOutlined className="auth-icon" />}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  style={{ marginBottom: "10px" }}
                />
                <Input.Password
                  prefix={<LockOutlined className="auth-icon" />}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  style={{ marginBottom: "10px" }}
                />
                {error && <Text type="danger">{error}</Text>}
                <Button type="primary" block onClick={handleLogin} className="auth-button">
                  Войти
                </Button>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Регистрация" key="register">
                <Text className="auth-title">Регистрация</Text>
                <p className="auth-subtitle">Создайте новый аккаунт</p>
                <Input
                  prefix={<MailOutlined className="auth-icon" />}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  style={{ marginBottom: "10px" }}
                />
                <Input.Password
                  prefix={<LockOutlined className="auth-icon" />}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  style={{ marginBottom: "10px" }}
                />
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
