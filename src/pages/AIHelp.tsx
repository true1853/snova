import React, { useState } from "react";
import { Table, Button, Modal, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RobotOutlined } from "@ant-design/icons";

interface Product {
  id: number;
  category: string;
  article: string;
  name: string;
  description: string;
  platform: string;
}

const productsData: Product[] = [
  { id: 1, category: "Электроника", article: "E123", name: "Смартфон", description: "Описание смартфона", platform: "OZON" },
  { id: 2, category: "Одежда", article: "C456", name: "Футболка", description: "Качественная футболка", platform: "WB" },
  { id: 3, category: "Электроника", article: "E789", name: "Ноутбук", description: "Мощный ноутбук", platform: "Яндекс Маркет" },
  { id: 4, category: "Дом", article: "H101", name: "Кофеварка", description: "Удобная кофеварка для дома", platform: "KAZAN Express" },
  { id: 5, category: "Мебель", article: "F202", name: "Диван", description: "Удобный диван", platform: "АВИТО" },
];

const ProductsTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedDescription, setEditedDescription] = useState("");

  const handleImprove = (record: Product) => {
    setSelectedProduct(record);
    setEditedDescription(record.description);
    setIsModalVisible(true);
  };

  const handleLaunchAI = () => {
    console.log("Запуск AI для товара:", selectedProduct);
    // Здесь можно реализовать вызов API и обновление editedDescription на основе ответа ИИ
  };

  const handleOk = () => {
    console.log("Сохранено новое описание:", editedDescription);
    setIsModalVisible(false);
    // Здесь можно обновить данные в БД
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Электроника", value: "Электроника" },
        { text: "Одежда", value: "Одежда" },
        { text: "Дом", value: "Дом" },
        { text: "Мебель", value: "Мебель" },
      ],
      onFilter: (value, record) => record.category === value,
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      filters: [
        { text: "E123", value: "E123" },
        { text: "C456", value: "C456" },
        { text: "E789", value: "E789" },
        { text: "H101", value: "H101" },
        { text: "F202", value: "F202" },
      ],
      onFilter: (value, record) => record.article === value,
      sorter: (a, b) => a.article.localeCompare(b.article),
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      filters: [
        { text: "Смартфон", value: "Смартфон" },
        { text: "Футболка", value: "Футболка" },
        { text: "Ноутбук", value: "Ноутбук" },
        { text: "Кофеварка", value: "Кофеварка" },
        { text: "Диван", value: "Диван" },
      ],
      onFilter: (value, record) => record.name === value,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      responsive: ["lg"],
    },
    {
      title: "Площадка",
      dataIndex: "platform",
      key: "platform",
      filters: [
        { text: "OZON", value: "OZON" },
        { text: "WB", value: "WB" },
        { text: "Яндекс Маркет", value: "Яндекс Маркет" },
        { text: "KAZAN Express", value: "KAZAN Express" },
        { text: "АВИТО", value: "АВИТО" },
      ],
      onFilter: (value, record) => record.platform === value,
      sorter: (a, b) => a.platform.localeCompare(b.platform),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleImprove(record)}>
          Улучшить
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h2>Список товаров</h2>
      <Table
        dataSource={productsData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={selectedProduct ? `Редактирование: ${selectedProduct.name}` : "Редактирование"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
      >
        {selectedProduct && (
          <div>
            <p>
              <strong>Категория:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Артикул:</strong> {selectedProduct.article}
            </p>
            <p>
              <strong>Площадка:</strong> {selectedProduct.platform}
            </p>
            <Input.TextArea
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Введите описание товара..."
            />
            <Button
              type="default"
              icon={<RobotOutlined />}
              onClick={handleLaunchAI}
              style={{ marginTop: 8 }}
            >
              Запустить AI
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsTable;
