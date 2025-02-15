import React from "react";
import { Row, Col, Card, Typography } from "antd";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div style={{ background: "#141414", minHeight: "100vh", padding: 16 }}>
      <Row gutter={[16, 16]}>
        {/* 1-я карточка */}
        <Col xs={24} md={4}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Выручка за этот месяц
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              35 599 ₽
            </Title>
            <Text style={{ color: "#52c41a" }}>Динамика +12.4%</Text>
          </Card>
        </Col>

        {/* 2-я карточка */}
        <Col xs={24} md={4}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Рассрочка за этот месяц
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              5 599 ₽
            </Title>
            <Text style={{ color: "#52c41a" }}>+10%</Text>
          </Card>
        </Col>

        {/* 3-я карточка */}
        <Col xs={24} md={4}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Показы
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              8,846
            </Title>
            <Text style={{ color: "#f5222d" }}>-5%</Text>
          </Card>
        </Col>

        {/* 4-я карточка */}
        <Col xs={24} md={4}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Заказы
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              560
            </Title>
            <Text style={{ color: "#52c41a" }}>+3.2%</Text>
          </Card>
        </Col>

        {/* 5-я карточка (пример - "Прибыль") */}
        <Col xs={24} md={4}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#999" }}>
              Прибыль
            </Title>
            <Title level={3} style={{ color: "#fff", marginTop: 4 }}>
              12 423 ₽
            </Title>
            <Text style={{ color: "#52c41a" }}>+5.4%</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
