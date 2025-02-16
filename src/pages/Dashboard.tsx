import React, { useState } from "react";
import { Row, Col, Card, Typography, DatePicker, Select, Table } from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState(null);
  const [category, setCategory] = useState(null);
  const [platform, setPlatform] = useState(null);

  const impressionsData = [
    { key: '1', product: 'Товар 1', lastWeek: 1200, thisWeek: 1500, change: '+25%' },
    { key: '2', product: 'Товар 2', lastWeek: 800, thisWeek: 950, change: '+18.75%' },
    { key: '3', product: 'Товар 3', lastWeek: 1000, thisWeek: 900, change: '-10%' },
  ];

  const columns = [
    { title: 'Товар', dataIndex: 'product', key: 'product', },
    { title: 'Прошлая неделя', dataIndex: 'lastWeek', key: 'lastWeek' },
    { title: 'Текущая неделя', dataIndex: 'thisWeek', key: 'thisWeek' },
    { title: 'Динамика', dataIndex: 'change', key: 'change' },
  ];

  return (
    <div style={{ background: "#141414", minHeight: "100vh", padding: 16 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card style={{ background: "#1f1f1f", padding: "16px" }} bordered={false}>
            <Title level={5} style={{ color: "#fff" }}>Индекс цен</Title>
            <Text style={{ color: "#fff" }}>88% Невыгодный</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ background: "#1f1f1f", padding: "16px" }} bordered={false}>
            <Title level={5} style={{ color: "#fff" }}>Индекс локализации</Title>
            <Text style={{ color: "#52c41a" }}>96% За последние 14 дней</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ background: "#1f1f1f", padding: "16px" }} bordered={false}>
            <Title level={5} style={{ color: "#fff" }}>Конкурентная позиция</Title>
            <Text style={{ color: "#fff" }}>#2 в 1% лучших</Text>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ background: "#1f1f1f" }} bordered={false}>
            <Title level={5} style={{ color: "#fff" }}>Количество показов за текущую и прошлую неделю</Title>
            <Table columns={columns} dataSource={impressionsData} pagination={false} style={{ color: "#fff" }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
