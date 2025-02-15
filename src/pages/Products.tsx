import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Card,
  Row,
  Col,
  Grid,
  Dropdown,
  Menu,
  Select,
  Descriptions,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RobotOutlined,
  FilterOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

interface Product {
  key: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  platform: string;
}

const data: Product[] = [
  {
    key: "1",
    name: "Смартфон XYZ",
    price: 19999,
    brand: "Brand A",
    category: "Электроника",
    rating: 4.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbdaChGdZ9Vxfs-D-ruO3rp0FsZE0cNEIA6Q&s",
    description: "Описание смартфона XYZ",
    platform: "OZON",
  },
  {
    key: "2",
    name: "Ноутбук ABC",
    price: 55999,
    brand: "Brand B",
    category: "Компьютеры",
    rating: 4.7,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdD0YAMFhLDf9NqMAyb1QlmzKuxVDP4tlSRA&s",
    description: "Описание ноутбука ABC",
    platform: "WB",
  },
  {
    key: "3",
    name: "Наушники 123",
    price: 4999,
    brand: "Brand A",
    category: "Аудиотехника",
    rating: 4.2,
    image:
      "https://www.sony.ru/image/dd18cf93606d238305a733d336c45537?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
    description: "Описание наушников 123",
    platform: "Яндекс Маркет",
  },
  {
    key: "4",
    name: "Телевизор 4K",
    price: 32999,
    brand: "Brand C",
    category: "Электроника",
    rating: 4.6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXoT7nK1GW6R7Scqeb2WgpXdDbLOXsNyTRMg&s",
    description: "Описание телевизора 4K",
    platform: "KAZAN Express",
  },
  {
    key: "5",
    name: "Планшет LMN",
    price: 17999,
    brand: "Brand D",
    category: "Планшеты",
    rating: 4.3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0nI3T4q2kAkMwg_F4x6y11yePxcHCgsyJrQ&s",
    description: "Описание планшета LMN",
    platform: "АВИТО",
  },
  {
    key: "6",
    name: "Игровая консоль",
    price: 24999,
    brand: "Brand E",
    category: "Игры",
    rating: 4.8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyKHgs_HJ2asAFSiYcjsbeaUEMrf92uxmacw&s",
    description: "Описание игровой консоли",
    platform: "OZON",
  },
  {
    key: "7",
    name: "Фотокамера 2000",
    price: 45999,
    brand: "Brand F",
    category: "Фото",
    rating: 4.4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYCyp3gPGUN82sWgck7573nHFnUPWvG2t8Rg&s",
    description: "Описание фотокамеры 2000",
    platform: "WB",
  },
  {
    key: "8",
    name: "Смарт-часы",
    price: 9999,
    brand: "Brand A",
    category: "Гаджеты",
    rating: 4.1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh-1SQe9FdPWsbIrq-Zszx74eTWPFSjMVCjg&s",
    description: "Описание смарт-часов",
    platform: "Яндекс Маркет",
  },
];

// Объекты для сопоставления цветов тегов
const categoryColors: { [key: string]: string } = {
  "Электроника": "blue",
  "Компьютеры": "geekblue",
  "Аудиотехника": "cyan",
  "Планшеты": "green",
  "Игры": "volcano",
  "Фото": "magenta",
  "Гаджеты": "purple",
};

const platformColors: { [key: string]: string } = {
  "OZON": "red",
  "WB": "orange",
  "Яндекс Маркет": "gold",
  "KAZAN Express": "lime",
  "АВИТО": "green",
};

const categories = Object.keys(categoryColors);
const platforms = Object.keys(platformColors);

const { useBreakpoint } = Grid;

const ProductsTable: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editForm] = Form.useForm();
  const [aiLoading, setAiLoading] = useState(false);

  // Состояние для фильтров (для карточного отображения)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState<Product[]>(data);

  const screens = useBreakpoint();
  const isSmallScreen = !screens.md;

  const handleEdit = (record: Product) => {
    setCurrentProduct(record);
    editForm.setFieldsValue({
      name: record.name,
      price: record.price,
      brand: record.brand,
      category: record.category,
      rating: record.rating,
      image: record.image,
      platform: record.platform,
      description: record.description,
    });
    setDrawerVisible(true);
  };

  const handleLaunchAI = () => {
    setAiLoading(true);
    console.log("Запуск AI для товара:", currentProduct);
    // Имитация асинхронного вызова API с задержкой 3 секунды
    setTimeout(() => {
      const currentDescription = editForm.getFieldValue("description") || "";
      editForm.setFieldsValue({
        description: `${currentDescription} (улучшено AI)`,
      });
      setAiLoading(false);
    }, 3000);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleEditFormFinish = (values: any) => {
    console.log("Сохраненные значения:", values);
    setDrawerVisible(false);
  };

  // Фильтрация для карточного отображения
  const handleFilterFinish = (values: any) => {
    const filtered = data.filter((product) => {
      if (
        values.name &&
        !product.name.toLowerCase().includes(values.name.toLowerCase())
      )
        return false;
      if (
        values.brand &&
        !product.brand.toLowerCase().includes(values.brand.toLowerCase())
      )
        return false;
      if (values.category && product.category !== values.category) return false;
      if (values.platform && product.platform !== values.platform)
        return false;
      if (values.priceFrom && product.price < values.priceFrom) return false;
      if (values.priceTo && product.price > values.priceTo) return false;
      return true;
    });
    setFilteredData(filtered);
    setFilterDrawerVisible(false);
  };

  const resetFilters = () => {
    filterForm.resetFields();
    setFilteredData(data);
  };

  const tableColumns: ColumnsType<Product> = [
    {
      title: "Изображение",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="товар" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: data
        .map((p) => p.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.name.includes(value as string),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        { text: "До 10 000", value: "lt10000" },
        { text: "10 000 - 30 000", value: "10to30" },
        { text: "Более 30 000", value: "gt30000" },
      ],
      onFilter: (value, record) => {
        if (value === "lt10000") return record.price < 10000;
        if (value === "10to30")
          return record.price >= 10000 && record.price <= 30000;
        if (value === "gt30000") return record.price > 30000;
        return false;
      },
    },
    {
      title: "Бренд",
      dataIndex: "brand",
      key: "brand",
      filters: data
        .map((p) => p.brand)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((brand) => ({ text: brand, value: brand })),
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
      render: (category: string) => (
        <Tag color={categoryColors[category] || "default"}>{category}</Tag>
      ),
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        { text: "4 и выше", value: "4up" },
        { text: "3 - 4", value: "3to4" },
        { text: "Ниже 3", value: "below3" },
      ],
      onFilter: (value, record) => {
        if (value === "4up") return record.rating >= 4;
        if (value === "3to4")
          return record.rating >= 3 && record.rating < 4;
        if (value === "below3") return record.rating < 3;
        return false;
      },
    },
    {
      title: "Площадка",
      dataIndex: "platform",
      key: "platform",
      filters: platforms.map((plat) => ({ text: plat, value: plat })),
      onFilter: (value, record) => record.platform === value,
      sorter: (a, b) => a.platform.localeCompare(b.platform),
      render: (platform: string) => (
        <Tag color={platformColors[platform] || "default"}>{platform}</Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={["click"]}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const getActionMenu = (record: Product) => (
    <Menu onClick={(e) => handleActionClick(record, e)}>
      <Menu.Item key="edit">Редактировать</Menu.Item>
      <Menu.Item key="hide">Скрыть</Menu.Item>
      <Menu.Item key="delete">Удалить</Menu.Item>
    </Menu>
  );

  const handleActionClick = (record: Product, e: any) => {
    switch (e.key) {
      case "edit":
        handleEdit(record);
        break;
      case "hide":
        console.log("Скрыть товар", record);
        break;
      case "delete":
        console.log("Удалить товар", record);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      {isSmallScreen ? (
        <>
          <Row gutter={[16, 16]}>
            {filteredData.map((product) => (
              <Col xs={24} sm={12} key={product.key}>
                <Card
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  }
                  title={product.name}
                  extra={
                    <Dropdown overlay={getActionMenu(product)} trigger={["click"]}>
                      <Button icon={<EllipsisOutlined />} />
                    </Dropdown>
                  }
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Цена">
                      {product.price}
                    </Descriptions.Item>
                    <Descriptions.Item label="Бренд">
                      {product.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="Категория">
                      <Tag color={categoryColors[product.category] || "default"}>
                        {product.category}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Рейтинг">
                      {product.rating}
                    </Descriptions.Item>
                    <Descriptions.Item label="Площадка">
                      <Tag color={platformColors[product.platform] || "default"}>
                        {product.platform}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Описание">
                      {product.description}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            shape="circle"
            icon={<FilterOutlined />}
            size="large"
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
            onClick={() => setFilterDrawerVisible(true)}
          />
        </>
      ) : (
        <Table columns={tableColumns} dataSource={data} />
      )}

      <Drawer
        title={
          currentProduct
            ? `Редактировать товар: ${currentProduct.name}`
            : "Редактировать товар"
        }
        placement="right"
        onClose={handleDrawerClose}
        visible={drawerVisible}
        width={400}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFormFinish}>
          <Form.Item label="Название" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Цена" name="price">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Бренд" name="brand">
            <Input />
          </Form.Item>
          <Form.Item label="Категория" name="category">
            <Select placeholder="Выберите категорию">
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Рейтинг" name="rating">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Изображение (URL)" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Площадка" name="platform">
            <Select placeholder="Выберите площадку">
              {platforms.map((plat) => (
                <Select.Option key={plat} value={plat}>
                  {plat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              icon={<RobotOutlined />}
              onClick={handleLaunchAI}
              loading={aiLoading}
              style={{ marginBottom: 16 }}
            >
              Запустить AI
            </Button>
            <Button type="primary" htmlType="submit" block>
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Фильтры"
        placement="bottom"
        onClose={() => setFilterDrawerVisible(false)}
        visible={filterDrawerVisible}
        height={300}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleFilterFinish}>
          <Form.Item label="Название" name="name">
            <Input placeholder="Введите название" />
          </Form.Item>
          <Form.Item label="Бренд" name="brand">
            <Input placeholder="Введите бренд" />
          </Form.Item>
          <Form.Item label="Категория" name="category">
            <Select placeholder="Выберите категорию" allowClear>
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Площадка" name="platform">
            <Select placeholder="Выберите площадку" allowClear>
              {platforms.map((plat) => (
                <Select.Option key={plat} value={plat}>
                  {plat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Цена от" name="priceFrom">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item label="Цена до" name="priceTo">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Применить фильтры
            </Button>
            <Button style={{ marginTop: 8 }} onClick={resetFilters} block>
              Сбросить фильтры
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductsTable;
