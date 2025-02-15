import React, { useState, useRef } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

interface Order {
  id: number;
  naimenovanie: string;
  artikul: string;
  kolichestvo: number;
  stoimost: number;
  summa: number;
  dataOplaty: string;
  dataOtgruzki: string;
  klient: string;
}

const data: Order[] = [
  {
    id: 1,
    naimenovanie: "Продукт A",
    artikul: "ART-001",
    kolichestvo: 10,
    stoimost: 100,
    summa: 1000,
    dataOplaty: "2025-01-01",
    dataOtgruzki: "2025-01-05",
    klient: "Клиент 1",
  },
  {
    id: 2,
    naimenovanie: "Продукт B",
    artikul: "ART-002",
    kolichestvo: 5,
    stoimost: 200,
    summa: 1000,
    dataOplaty: "2025-02-01",
    dataOtgruzki: "2025-02-05",
    klient: "Клиент 2",
  },
  // Добавьте остальные заказы
];

const OrdersTable: React.FC = () => {
  // Удалили переменную searchText, так как она не используется
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  // Функция для настройки поиска в столбце
  const getColumnSearchProps = (dataIndex: keyof Order): ColumnType<Order> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Поиск по ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Найти
          </Button>
          <Button
            onClick={() => handleReset(clearFilters!)}
            size="small"
            style={{ width: 90 }}
          >
            Сбросить
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase())
        : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Order
  ) => {
    confirm();
    // Удаляем использование setSearchText, так как переменная больше не объявлена
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    // Нет необходимости сбрасывать searchText
  };

  const columns: ColumnType<Order>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Наименование",
      dataIndex: "naimenovanie",
      key: "naimenovanie",
      sorter: (a, b) => a.naimenovanie.localeCompare(b.naimenovanie),
      ...getColumnSearchProps("naimenovanie"),
    },
    {
      title: "Артикул",
      dataIndex: "artikul",
      key: "artikul",
      sorter: (a, b) => a.artikul.localeCompare(b.artikul),
      ...getColumnSearchProps("artikul"),
    },
    {
      title: "Количество",
      dataIndex: "kolichestvo",
      key: "kolichestvo",
      sorter: (a, b) => a.kolichestvo - b.kolichestvo,
    },
    {
      title: "Стоимость",
      dataIndex: "stoimost",
      key: "stoimost",
      sorter: (a, b) => a.stoimost - b.stoimost,
    },
    {
      title: "Сумма",
      dataIndex: "summa",
      key: "summa",
      sorter: (a, b) => a.summa - b.summa,
    },
    {
      title: "Дата оплаты",
      dataIndex: "dataOplaty",
      key: "dataOplaty",
      sorter: (a, b) =>
        new Date(a.dataOplaty).getTime() - new Date(b.dataOplaty).getTime(),
    },
    {
      title: "Дата отгрузки",
      dataIndex: "dataOtgruzki",
      key: "dataOtgruzki",
      sorter: (a, b) =>
        new Date(a.dataOtgruzki).getTime() - new Date(b.dataOtgruzki).getTime(),
    },
    {
      title: "Клиент",
      dataIndex: "klient",
      key: "klient",
      sorter: (a, b) => a.klient.localeCompare(b.klient),
      ...getColumnSearchProps("klient"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrdersTable;
