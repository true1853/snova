import React, { useState } from "react";
import {
  Table,
  Spin,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Row,
  Col,
  Space,
  Popover,
} from "antd";
import { gql, useQuery, useMutation } from "@apollo/client";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";

const { Option } = Select;

const GET_PRODUCTS = gql`
  query GetProducts($orderBy: String, $orderDir: String, $filter: JSON) {
    products(orderBy: $orderBy, orderDir: $orderDir, filter: $filter) {
      id
      name
      description
      sku
      barcode
      price
      currency
      discount_price
      stock_quantity
      availability_status
      brand
      created_at
      updated_at
      is_active
      category {
        id
        name
      }
      images {
        id
        url
        alt_text
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!,
    $description: String,
    $sku: String,
    $barcode: String,
    $price: Float!,
    $currency: String,
    $discount_price: Float,
    $stock_quantity: Int,
    $availability_status: String,
    $category_id: Int,
    $brand: String,
    $attributes: JSON,
    $is_active: Boolean
  ) {
    createProduct(
      name: $name,
      description: $description,
      sku: $sku,
      barcode: $barcode,
      price: $price,
      currency: $currency,
      discount_price: $discount_price,
      stock_quantity: $stock_quantity,
      availability_status: $availability_status,
      category_id: $category_id,
      brand: $brand,
      attributes: $attributes,
      is_active: $is_active
    ) {
      id
      name
      price
      currency
      created_at
    }
  }
`;

const ALL_COLUMNS = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Название", dataIndex: "name", key: "name" },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
    render: (text: string) => (text ? text.substring(0, 50) + "..." : ""),
  },
  { title: "SKU", dataIndex: "sku", key: "sku" },
  { title: "Штрихкод", dataIndex: "barcode", key: "barcode" },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    render: (price: number, record: any) => `${price} ${record.currency}`,
  },
  {
    title: "Скидка",
    dataIndex: "discount_price",
    key: "discount_price",
    render: (dp: number, record: any) =>
      dp ? `${dp} ${record.currency}` : "-",
  },
  { title: "Кол-во", dataIndex: "stock_quantity", key: "stock_quantity" },
  {
    title: "Статус",
    dataIndex: "availability_status",
    key: "availability_status",
  },
  { title: "Бренд", dataIndex: "brand", key: "brand" },
  {
    title: "Категория",
    dataIndex: "category",
    key: "category",
    render: (category: any) => (category ? category.name : ""),
  },
  { title: "Создан", dataIndex: "created_at", key: "created_at" },
  { title: "Обновлен", dataIndex: "updated_at", key: "updated_at" },
  {
    title: "Активен",
    dataIndex: "is_active",
    key: "is_active",
    render: (isActive: boolean) => (isActive ? "Да" : "Нет"),
  },
];

const ProductsTable: React.FC = () => {
  // Извлекаем токен и userId из localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [selectedColumns, setSelectedColumns] = useState(
    ALL_COLUMNS.map((col) => col.key)
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  // Передаем в запрос фильтр по user_id, если userId существует
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      orderBy: "name",
      orderDir: "ASC",
      filter: userId ? { user_id: parseInt(userId) } : {},
    },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: () => {
      refetch();
      setDrawerVisible(false);
      form.resetFields();
    },
    onError: (err) => {
      console.error("Ошибка создания продукта:", err);
    },
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Загрузка данных..." />
      </div>
    );
  }
  if (error) return <p>Ошибка: {error.message}</p>;

  const columns = ALL_COLUMNS.filter((col) =>
    selectedColumns.includes(col.key)
  );

  const handleCreate = (values: any) => {
    createProduct({
      variables: {
        name: values.name,
        description: values.description,
        sku: values.sku,
        barcode: values.barcode,
        price: values.price,
        currency: values.currency || "USD",
        discount_price: values.discount_price,
        stock_quantity: values.stock_quantity,
        availability_status: values.availability_status,
        category_id: values.category_id,
        brand: values.brand,
        attributes: values.attributes,
        is_active: values.is_active,
      },
    });
  };

  const columnSelectContent = (
    <Select
      mode="multiple"
      placeholder="Выберите столбцы"
      style={{ minWidth: 300 }}
      value={selectedColumns}
      onChange={(value) => setSelectedColumns(value)}
    >
      {ALL_COLUMNS.map((col) => (
        <Option key={col.key} value={col.key}>
          {col.title}
        </Option>
      ))}
    </Select>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Popover content={columnSelectContent} title="Выберите столбцы">
            <Button icon={<SettingOutlined />} />
          </Popover>
        </Col>
        <Col>
          <Space>
            <Button onClick={() => refetch()}>Обновить</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerVisible(true)}
            >
              Добавить
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data.products}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
      <Drawer
        title="Добавить новый продукт"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
          <Form.Item label="Штрихкод" name="barcode">
            <Input />
          </Form.Item>
          <Form.Item
            label="Цена"
            name="price"
            rules={[{ required: true, message: "Введите цену" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Валюта" name="currency" initialValue="USD">
            <Input />
          </Form.Item>
          <Form.Item label="Цена со скидкой" name="discount_price">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Кол-во" name="stock_quantity">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Статус наличия" name="availability_status">
            <Input />
          </Form.Item>
          <Form.Item label="ID категории" name="category_id">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Бренд" name="brand">
            <Input />
          </Form.Item>
          <Form.Item label="Атрибуты (JSON)" name="attributes">
            <Input.TextArea rows={2} placeholder='{"key": "value"}' />
          </Form.Item>
          <Form.Item
            label="Активен"
            name="is_active"
            valuePropName="checked"
            initialValue
          >
            <Checkbox />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductsTable;
