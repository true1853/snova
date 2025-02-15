import React from "react";
import { Row, Col, Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

// Пример данных для графика (12 месяцев)
const barData = [200, 400, 300, 600, 800, 1000, 700, 900, 400, 1200, 900, 500];

// Пример данных для "Топ продаж"
const topSales = [
  { name: "Dreamline Dreamroll SleepDream (80 / 200)", value: 33234 },
  { name: "Dreamline Dreamroll SleepDream (80 / 200)", value: 33234 },
  { name: "Dreamline Dreamroll SleepDream (80 / 200)", value: 33234 },
  { name: "Dreamline Dreamroll SleepDream (80 / 200)", value: 33234 },
  { name: "Dreamline Dreamroll SleepDream (80 / 200)", value: 33234 },
];

const Dashboard: React.FC = () => {
  return (
    <div style={{ background: "#141414", minHeight: "100vh", padding: 16 }}>
      {/* Первые 4 карточки */}
      <Row gutter={[16, 16]}>
        {/* Карточка 1: Выручка за этот месяц с блоком "За сегодня" */}
        <Col xs={24} sm={12} md={6} lg={6} style={{ display: "flex" }}>
          <Card style={{ background: "#1f1f1f", flex: 1 }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Выручка за этот месяц
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              35 599 ₽
            </Title>
            <Text style={{ color: "#52c41a" }}>Динамика +12.4%</Text>
            <div style={{ margin: "8px 0", borderTop: "1px solid #333" }} />
            <Text style={{ color: "#999" }}>За сегодня </Text>
            <Text style={{ color: "#fff" }}>2 423 ₽</Text>
          </Card>
        </Col>

        {/* Карточка 2: Расходы за этот месяц с блоком "За сегодня" */}
        <Col xs={24} sm={12} md={6} lg={6} style={{ display: "flex" }}>
          <Card style={{ background: "#1f1f1f", flex: 1 }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Расходы за этот месяц
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              5 599 ₽
            </Title>
            <div style={{ margin: "8px 0", borderTop: "1px solid #333" }} />
            <Text style={{ color: "#999" }}>За сегодня </Text>
            <Text style={{ color: "#fff" }}>2 349 ₽</Text>
          </Card>
        </Col>

        {/* Карточка 3: Показы с волной */}
        <Col xs={24} sm={12} md={6} lg={6} style={{ display: "flex" }}>
          <Card style={{ background: "#1f1f1f", flex: 1 }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Показы
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              8,846
            </Title>
            <div style={{ width: "100%", height: 60, margin: "12px 0" }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,30 C20,20 40,35 60,15 C80,0 100,20 100,20 L100,40 L0,40 Z"
                  fill="#52c41a"
                />
              </svg>
            </div>
          </Card>
        </Col>

        {/* Карточка 4: Заказы с мини-столбиками */}
        <Col xs={24} sm={12} md={6} lg={6} style={{ display: "flex" }}>
          <Card style={{ background: "#1f1f1f", flex: 1 }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Заказы
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              560
            </Title>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: 60,
                margin: "12px 0",
              }}
            >
              {[10, 40, 25, 50, 20, 35, 45, 30].map((height, index) => (
                <div
                  key={index}
                  style={{
                    background: "#52c41a",
                    width: "10%",
                    height: `${height}%`,
                    marginLeft: index === 0 ? 0 : 4,
                  }}
                />
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Блок "Динамика продаж" */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            {/* Заголовок и ссылка "Подробнее" (на /orders) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Title level={5} style={{ color: "#999", margin: 0 }}>
                Динамика продаж
              </Title>
              <Link to="/orders" style={{ color: "#999" }}>
                Подробнее
              </Link>
            </div>

            <Row gutter={[16, 16]}>
              {/* Левая часть: график */}
              <Col xs={24} md={16}>
                <Text style={{ color: "#999" }}>Продажи в этом месяце</Text>
                <div
                  style={{
                    position: "relative",
                    height: 200,
                    marginTop: 16,
                    padding: "0 8px",
                    border: "1px solid #333",
                    background: "linear-gradient(to bottom, #2a2a2a, #141414)",
                  }}
                >
                  {/* Столбчатый график */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "100%",
                    }}
                  >
                    {barData.map((value, index) => {
                      const maxValue = 1200;
                      const barHeight = (value / maxValue) * 100;
                      return (
                        <div
                          key={index}
                          style={{
                            background: "#52c41a",
                            width: "6%",
                            margin: "0 2%",
                            height: `${barHeight}%`,
                            transition: "height 0.3s ease",
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* Ось X с цифрами */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 6px",
                      color: "#666",
                      fontSize: 12,
                    }}
                  >
                    {barData.map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Легенда справа: "Выручка" */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -30,
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                      color: "#999",
                      fontSize: 12,
                    }}
                  >
                    Выручка
                  </div>
                </div>
                {/* Легенда снизу: "Месяц" */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 4,
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  Месяц
                </div>
              </Col>

              {/* Правая часть: Топ продаж */}
              <Col xs={24} md={8}>
                <Text style={{ color: "#999" }}>Топ продаж</Text>
                <div style={{ marginTop: 16 }}>
                  {topSales.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          background: "#52c41a",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#000",
                          fontWeight: "bold",
                          marginRight: 8,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div style={{ color: "#fff" }}>
                        {item.name} — {item.value.toLocaleString()} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
