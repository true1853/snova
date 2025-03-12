import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Modal,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthProvider";
import { useMediaQuery } from "react-responsive";
import "../styles/account.css";

const { Content } = Layout;

const Account: React.FC = () => {
  const { token } = useAuth() || {};
  // Получаем userId из localStorage (он должен сохраняться при логине)
  const userId = localStorage.getItem("userId");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ozonClientId, setOzonClientId] = useState("");
  const [ozonApiKey, setOzonApiKey] = useState("");

  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [storeModalVisible, setStoreModalVisible] = useState(false);

  const [balance] = useState<number>(1000);
  const [cardPaymentModalVisible, setCardPaymentModalVisible] = useState(false);
  const [invoicePaymentModalVisible, setInvoicePaymentModalVisible] = useState(false);
  const [cardPaymentAmount, setCardPaymentAmount] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const cardStyle = { width: "100%", minHeight: isMobile ? "auto" : "350px" };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token || !userId) return;
        const query = `
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
              avatar
              ozon_client_id
              ozon_api_key
            }
          }
        `;
        const variables = { id: userId };
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query, variables }),
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        const result = await response.json();
        const data = result.data.user;
        setUsername(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
        if (data.ozon_client_id) setOzonClientId(data.ozon_client_id);
        if (data.ozon_api_key) setOzonApiKey(data.ozon_api_key);
      } catch (error) {
        console.error("❌ Ошибка при загрузке данных:", error);
        message.error("Произошла ошибка, попробуйте позже.");
      }
    };

    fetchUserData();
  }, [token, userId]);

  // Функция для обновления данных пользователя
  const handleUpdateUser = async () => {
    if (!token || !userId) {
      message.error("Пользователь не авторизован");
      return;
    }
    const mutation = `
      mutation UpdateUser($id: ID!, $name: String, $email: String, $password: String, $avatar: String) {
        updateUser(id: $id, name: $name, email: $email, password: $password, avatar: $avatar) {
          id
          name
          email
          avatar
        }
      }
    `;
    const variables = {
      id: userId,
      name: username,
      email: email,
      // Если поле password пустое, можно не передавать его
      password: password || undefined,
      avatar: avatar,
    };
    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
      if (!response.ok) {
        throw new Error("Ошибка обновления данных");
      }
      const result = await response.json();
      const updatedUser = result.data.updateUser;
      setUsername(updatedUser.name);
      setEmail(updatedUser.email);
      setAvatar(updatedUser.avatar);
      message.success("Данные обновлены");
      // Очистка поля пароля после обновления
      setPassword("");
    } catch (error) {
      console.error("Ошибка обновления пользователя:", error);
      message.error("Ошибка обновления данных пользователя");
    }
  };

  const connectStore = async () => {
    if (!userId) {
      message.error("Пользователь не авторизован");
      return;
    }
    if (selectedStore === "OZON") {
      if (!ozonClientId || !ozonApiKey) {
        message.error("Пожалуйста, заполните ozon_client_id и ozon_api_key");
        return;
      }
      const mutation = `
        mutation UpdateUser($id: ID!, $ozon_client_id: String, $ozon_api_key: String) {
          updateUser(id: $id, ozon_client_id: $ozon_client_id, ozon_api_key: $ozon_api_key) {
            id
            ozon_client_id
            ozon_api_key
          }
        }
      `;
      const variables = {
        id: userId,
        ozon_client_id: ozonClientId,
        ozon_api_key: ozonApiKey,
      };
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: mutation, variables }),
        });
        if (!response.ok) {
          throw new Error("Ошибка подключения магазина");
        }
        const result = await response.json();
        const updatedUser = result.data.updateUser;
        setOzonClientId(updatedUser.ozon_client_id);
        setOzonApiKey(updatedUser.ozon_api_key);
        message.success(`Магазин ${selectedStore} подключен`);
      } catch (error) {
        console.error("❌ Ошибка при подключении магазина:", error);
        message.error("Ошибка при подключении магазина");
      }
    } else {
      message.success(`Магазин ${selectedStore} подключен`);
    }
    setStoreModalVisible(false);
  };

  return (
    <Layout className="account-container">
      <Content className="account-content" style={{ padding: "20px 0" }}>
        <Row gutter={[16, 16]} justify="center" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* 1-я колонка: Аккаунт */}
          <Col xs={24} sm={24} md={8} style={{ minWidth: "300px" }}>
            <Card className="account-card" title="Аккаунт" style={cardStyle}>
              <div className="account-avatar-container" style={{ marginBottom: 16 }}>
                <Avatar
                  size={100}
                  src={avatar}
                  icon={!avatar ? <UserOutlined /> : undefined}
                  style={{ marginBottom: 8 }}
                />
                <Upload
                  action="/api/upload-avatar"
                  method="POST"
                  headers={{ Authorization: `Bearer ${token}` }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
                </Upload>
              </div>
              <Input
                placeholder="Имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="account-input"
                style={{ marginBottom: 8 }}
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="account-input"
                style={{ marginBottom: 8 }}
              />
              <Input.Password
                placeholder="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="account-input"
                style={{ marginBottom: 8 }}
              />
              <Button type="primary" block className="account-button" onClick={handleUpdateUser}>
                Сохранить
              </Button>
            </Card>
          </Col>

          {/* 2-я колонка: Подключение магазинов */}
          <Col xs={24} sm={24} md={8} style={{ minWidth: "300px" }}>
            <Card className="account-card" title="Подключение магазинов" style={cardStyle}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Button
                  type={ozonClientId && ozonApiKey ? "primary" : "default"}
                  onClick={() => {
                    setSelectedStore("OZON");
                    setStoreModalVisible(true);
                  }}
                >
                  OZON{" "}
                  {ozonClientId && ozonApiKey ? (
                    <span style={{ fontSize: "12px", marginLeft: "8px" }}>Активно</span>
                  ) : null}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedStore("WB");
                    setStoreModalVisible(true);
                  }}
                >
                  WB
                </Button>
                <Button
                  onClick={() => {
                    setSelectedStore("Яндекс Маркет");
                    setStoreModalVisible(true);
                  }}
                >
                  Яндекс Маркет
                </Button>
                <Button
                  onClick={() => {
                    setSelectedStore("KAZAN Express");
                    setStoreModalVisible(true);
                  }}
                >
                  KAZAN Express
                </Button>
              </div>
            </Card>
          </Col>

          {/* 3-я колонка: Финансы */}
          <Col xs={24} sm={24} md={8} style={{ minWidth: "300px" }}>
            <Card className="account-card" title="Финансы" style={cardStyle}>
              <p>Баланс: {balance} руб.</p>
              <Button
                icon={<CreditCardOutlined />}
                onClick={() => setCardPaymentModalVisible(true)}
                style={{ marginBottom: "10px" }}
                block
              >
                Оплата картой
              </Button>
              <Button
                icon={<WalletOutlined />}
                onClick={() => setInvoicePaymentModalVisible(true)}
                block
              >
                Оплата по счету
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Модальное окно для подключения магазина */}
        <Modal
          title={`Подключение ${selectedStore}`}
          open={storeModalVisible}
          onCancel={() => setStoreModalVisible(false)}
          footer={[
            <Button key="connect" type="primary" onClick={connectStore}>
              Подключить
            </Button>,
          ]}
        >
          {selectedStore === "OZON" ? (
            <>
              <Input
                placeholder="Введите ozon_client_id"
                value={ozonClientId}
                onChange={(e) => setOzonClientId(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <Input
                placeholder="Введите ozon_api_key"
                value={ozonApiKey}
                onChange={(e) => setOzonApiKey(e.target.value)}
              />
            </>
          ) : (
            <p>Нажмите «Подключить» для подключения магазина {selectedStore}.</p>
          )}
        </Modal>

        {/* Модальное окно для оплаты картой */}
        <Modal
          title="Оплата картой"
          open={cardPaymentModalVisible}
          onCancel={() => setCardPaymentModalVisible(false)}
          footer={null}
        >
          <Input
            placeholder="Введите сумму для оплаты"
            value={cardPaymentAmount}
            onChange={(e) => setCardPaymentAmount(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                message.success("Оплата картой выполнена");
                setCardPaymentModalVisible(false);
                setCardPaymentAmount("");
              }}
            >
              Оплатить картой
            </Button>
            <Button
              onClick={() => {
                message.success("Оплата через СБП выполнена");
                setCardPaymentModalVisible(false);
                setCardPaymentAmount("");
              }}
            >
              Оплатить СБП
            </Button>
          </div>
        </Modal>

        {/* Модальное окно для оплаты по счету */}
        <Modal
          title="Оплата по счету"
          open={invoicePaymentModalVisible}
          onCancel={() => setInvoicePaymentModalVisible(false)}
          footer={[
            <Button
              key="download"
              type="primary"
              onClick={() => {
                message.success("Счет скачан");
                setInvoicePaymentModalVisible(false);
              }}
            >
              Скачать
            </Button>,
          ]}
        >
          <Input
            placeholder="Введите сумму для оплаты"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default Account;
