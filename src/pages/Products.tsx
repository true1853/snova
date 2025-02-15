import React, { useState } from "react";
import { Table, Dropdown, Menu, Button, Drawer, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Product {
  key: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  rating: number;
  image: string;
}

const data: Product[] = [
  {
    key: "1",
    name: "Смартфон XYZ",
    price: 19999,
    brand: "Brand A",
    category: "Электроника",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1738969773091-abcf274f7e0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxODY2Nzh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Mzk1Njc4MDN8&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    key: "2",
    name: "Ноутбук ABC",
    price: 55999,
    brand: "Brand B",
    category: "Компьютеры",
    rating: 4.7,
    image: "https://via.placeholder.com/50?text=ABC",
  },
  {
    key: "3",
    name: "Наушники 123",
    price: 4999,
    brand: "Brand A",
    category: "Аудиотехника",
    rating: 4.2,
    image: "https://via.placeholder.com/50?text=123",
  },
  {
    key: "4",
    name: "Телевизор 4K",
    price: 32999,
    brand: "Brand C",
    category: "Электроника",
    rating: 4.6,
    image: "https://via.placeholder.com/50?text=4K",
  },
  {
    key: "5",
    name: "Планшет LMN",
    price: 17999,
    brand: "Brand D",
    category: "Планшеты",
    rating: 4.3,
    image: "https://via.placeholder.com/50?text=LMN",
  },
  {
    key: "6",
    name: "Игровая консоль",
    price: 24999,
    brand: "Brand E",
    category: "Игры",
    rating: 4.8,
    image: "https://via.placeholder.com/50?text=Console",
  },
  {
    key: "7",
    name: "Фотокамера 2000",
    price: 45999,
    brand: "Brand F",
    category: "Фото",
    rating: 4.4,
    image: "https://via.placeholder.com/50?text=2000",
  },
  {
    key: "8",
    name: "Смарт-часы",
    price: 9999,
    brand: "Brand A",
    category: "Гаджеты",
    rating: 4.1,
    image: "https://via.placeholder.com/50?text=Watch",
  },
];

const ProductsTable: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleMenuClick = (record: Product, e: any) => {
    if (e.key === "block") {
      // Логика блокировки товара
      console.log("Блокировка товара", record);
    } else if (e.key === "edit") {
      setCurrentProduct(record);
      setDrawerVisible(true);
    } else if (e.key === "delete") {
      // Логика удаления товара
      console.log("Удаление товара", record);
    }
  };

  const actionMenu = (record: Product) => (
    <Menu onClick={(e) => handleMenuClick(record, e)}>
      <Menu.Item key="block">Заблокировать</Menu.Item>
      <Menu.Item key="edit">Редактировать</Menu.Item>
      <Menu.Item key="delete">Удалить</Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<Product> = [
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
      filters: [
        { text: "Смартфон XYZ", value: "Смартфон XYZ" },
        { text: "Ноутбук ABC", value: "Ноутбук ABC" },
        { text: "Наушники 123", value: "Наушники 123" },
        { text: "Телевизор 4K", value: "Телевизор 4K" },
        { text: "Планшет LMN", value: "Планшет LMN" },
        { text: "Игровая консоль", value: "Игровая консоль" },
        { text: "Фотокамера 2000", value: "Фотокамера 2000" },
        { text: "Смарт-часы", value: "Смарт-часы" },
      ],
      onFilter: (value, record) => record.name.includes(value as string),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Бренд",
      dataIndex: "brand",
      key: "brand",
      filters: [
        { text: "Brand A", value: "Brand A" },
        { text: "Brand B", value: "Brand B" },
        { text: "Brand C", value: "Brand C" },
        { text: "Brand D", value: "Brand D" },
        { text: "Brand E", value: "Brand E" },
        { text: "Brand F", value: "Brand F" },
      ],
      onFilter: (value, record) => record.brand.indexOf(value as string) === 0,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Электроника", value: "Электроника" },
        { text: "Компьютеры", value: "Компьютеры" },
        { text: "Аудиотехника", value: "Аудиотехника" },
        { text: "Планшеты", value: "Планшеты" },
        { text: "Игры", value: "Игры" },
        { text: "Фото", value: "Фото" },
        { text: "Гаджеты", value: "Гаджеты" },
      ],
      onFilter: (value, record) =>
        record.category.indexOf(value as string) === 0,
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button>Действия</Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />

      <Drawer
        title="Редактировать товар"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        {currentProduct && (
          <Form
            layout="vertical"
            initialValues={{
              name: currentProduct.name,
              price: currentProduct.price,
              brand: currentProduct.brand,
              category: currentProduct.category,
              rating: currentProduct.rating,
              image: currentProduct.image,
            }}
          >
            <Form.Item label="Изображение (URL)" name="image">
              <Input />
            </Form.Item>
            {currentProduct.image && (
              <img
                src={currentProduct.image}
                alt="товар"
                style={{ width: "100%", marginBottom: 16 }}
              />
            )}
            <Form.Item label="Название" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Цена" name="price">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Бренд" name="brand">
              <Input />
            </Form.Item>
            <Form.Item label="Категория" name="category">
              <Input />
            </Form.Item>
            <Form.Item label="Рейтинг" name="rating">
              <Input type="number" />
            </Form.Item>
            {/* Здесь можно добавить кнопку для сохранения изменений */}
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default ProductsTable;
