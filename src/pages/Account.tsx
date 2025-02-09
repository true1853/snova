import React, { useState, useEffect } from "react";
import { Layout, Card, Input, Button, Upload, Avatar, message, Modal, Row, Col } from "antd";
import { UploadOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons";
import "../styles/account.css";

const { Content } = Layout;

const Account: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Токен отсутствует. Авторизуйтесь снова.");
          return;
        }

        const response = await fetch("/api/account", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          message.error("Ошибка авторизации. Войдите заново.");
          return;
        }

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
        setAvatar(data.avatar);
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Токен отсутствует. Авторизуйтесь снова.");
      return;
    }

    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password, avatar }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления данных");
      }

      message.success("Данные успешно обновлены");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done" && info.file.response) {
      setAvatar(info.file.response.url);
    }
  };

  const handleConnectStore = (store: string) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  return (
    <Layout className="account-container">
      <Content className="account-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10} lg={8}>
            <Card className="account-card" title="Аккаунт">
              <div className="account-avatar-container">
                <Avatar size={100} src={avatar} icon={!avatar ? <UserOutlined /> : undefined} />
                <Upload
                  action="/api/upload-avatar"
                  method="POST"
                  headers={{ Authorization: `Bearer ${localStorage.getItem("token")}` }}
                  showUploadList={false}
                  onChange={handleAvatarChange}
                >
                  <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
                </Upload>
              </div>
              <Input placeholder="Имя" value={username} onChange={(e) => setUsername(e.target.value)} className="account-input" />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="account-input" />
              <Input.Password placeholder="Новый пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="account-input" />
              <Button type="primary" block onClick={handleSave} className="account-button">
                Сохранить
              </Button>
            </Card>
          </Col>
          <Col xs={24} md={14} lg={16}>
            <Card className="account-card" title="Подключение магазинов">
              <Button icon={<ShopOutlined />} block onClick={() => handleConnectStore("ozon")}>Подключить OZON</Button>
              <Button icon={<ShopOutlined />} block onClick={() => handleConnectStore("wildberries")} style={{ marginTop: 10 }}>Подключить Wildberries</Button>
              <Button icon={<ShopOutlined />} block onClick={() => handleConnectStore("yandexmarket")} style={{ marginTop: 10 }}>Подключить Yandex Market</Button>
            </Card>
          </Col>
        </Row>
      </Content>
      <Modal
        title={`Подключение к ${selectedStore}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p>Для подключения к {selectedStore}, пожалуйста, войдите в свой аккаунт и авторизуйте приложение.</p>
        <Button type="primary" block onClick={() => message.success(`${selectedStore} подключен!`)}>Авторизоваться через {selectedStore}</Button>
      </Modal>
    </Layout>
  );
};

export default Account;
