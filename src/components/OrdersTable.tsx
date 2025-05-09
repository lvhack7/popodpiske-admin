import React, { useState, useRef } from 'react';
import { Table, Tag, Input, Button, Space, Typography, DatePicker } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Order from '../models/Order';
import { Payment } from '../models/Payment';
import { formatNumber } from '../utils';
import ru_RU from 'antd/es/locale/ru_RU';


const { Title } = Typography;
const { RangePicker } = DatePicker;

const statusMapping: { [key: string]: { text: string; color: string } } = {
  success: { text: 'Успешно', color: 'green' },
  failed: { text: 'Неуспешно', color: 'red' },
  pending: { text: 'В ожидании', color: 'orange' },
  cancel: { text: 'Не будет списано', color: 'gray' }
};

const orderStatusMapping: { [key: string]: { text: string; color: string } } = {
  active: { text: 'Активный', color: 'green' },
  past_due: { text: 'Просроченный', color: 'orange' },
  completed: { text: 'Завершенный', color: 'blue' },
  pending: { text: 'В процессе', color: 'gray' },
  cancelled: { text: 'Отмененный', color: 'red' }
};

interface OrdersListProps {
  orders: Order[]; // data from RTK Query or another source
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<typeof Input>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  // Helper to add search props to a column.
  const getColumnSearchProps = (
    dataIndex: string | string[]
  ): ColumnType<Order> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput as any}
          placeholder='Введите название'
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys as string[],
              confirm,
              Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex
            )
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys as string[],
                confirm,
                Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Найти
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters!);
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Сбросить
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      // For nested values, use a helper to extract the value.
      const getNestedValue = (obj: any, keys: string[]): any =>
        keys.reduce((acc, key) => (acc ? acc[key] : ''), obj);
      let recordValue = '';
      if (Array.isArray(dataIndex)) {
        recordValue = getNestedValue(record, dataIndex) || '';
      } else {
        recordValue = (record[dataIndex as keyof Order] ?? '').toString();
      }
      return recordValue
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.current) {
            // @ts-ignore
            searchInput.current.select();
          }
        }, 100);
      }
    },
    render: (text: string) =>
      searchedColumn === (Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // --- Helpers for formatting and building payment data ---
  const formatDate = (date?: string | Date): string => {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // const buildPaymentsArray = (order: Order): Payment[] => {
  //   const { payments, numberOfMonths, monthlyPrice, status } = order;

  //   if (order.nextBillingDate === null && status === "pending") return [];

  //   const sorted = [...payments].sort(
  //     (a, b) =>
  //       new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  //   );

  //   const monthlyAmt = monthlyPrice;
  //   let nextBillingDate = order.nextBillingDate;

  //   const result: Payment[] = [];
  //   for (let i = 0; i < numberOfMonths; i++) {
  //     const real = sorted[i];
  //     if (real) {
  //       result.push(real);
  //     } else {
  //       result.push({
  //         id: 0,
  //         amount: monthlyAmt,
  //         currency: 'KZT',
  //         status: order.status === "cancelled" ? 'cancel' : 'pending',
  //         paymentDate: nextBillingDate,
  //       });
  //       nextBillingDate = getNextBillingDate(nextBillingDate);
  //     }
  //   }

  //   return result;
  // };

  const buildPaymentsArray = (order: Order): Payment[] => {
    return [...order.payments].sort(
      (a, b) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
    );
  };

  // --- Payment table columns (for the expandable section) ---
  const paymentColumns: ColumnsType<Payment> = [
    {
      title: 'Дата платежа',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (val: Date) => formatDate(val),
    },
    {
      title: 'Сумма, тенге',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => formatNumber(val),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const { text, color } =
          statusMapping[status] || { text: status, color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (val?: string) => val || '—',
    },
  ];

  // --- Main table columns ---
  const columns: ColumnsType<Order> = [
    {
      title: '#Заказ',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => id.toString(),
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Статус заказа',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const { text, color } =
          orderStatusMapping[status] || { text: status, color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: Object.entries(orderStatusMapping).map(([value, { text }]) => ({
        text,
        value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Название курса',
      dataIndex: 'courseName',
      key: 'courseName',
      ...getColumnSearchProps('courseName'),
    },
    {
      title: 'Общая стоимость, тенге',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice: number) => formatNumber(totalPrice),
    },
    {
      title: 'Создатель',
      dataIndex: ['link', 'admin', 'login'],
      key: 'adminLogin',
      render: (login: string) => login || '—',
      ...getColumnSearchProps(['link', 'admin', 'login']),
    },
    {
      title: 'Количество месяцев',
      dataIndex: 'numberOfMonths',
      key: 'numberOfMonths',
    },
    {
      title: 'Ежемесячная цена, тенге',
      dataIndex: 'monthlyPrice',
      key: 'monthlyPrice',
      render: (price: number) => formatNumber(price),
    },
    // Новые колонки для оплаты:
    {
      title: 'Сколько оплачено месяцев',
      key: 'paidMonths',
      render: (_: any, record: Order) => {
        const paidMonths = record.payments
          ? record.payments.filter((p) => p.status === 'success').length
          : 0;
        return paidMonths;
      },
    },
    {
      title: 'Сколько оплачено в сумме',
      key: 'paidSum',
      render: (_: any, record: Order) => {
        const paidMonths = record.payments
          ? record.payments.filter((p) => p.status === 'success').length
          : 0;
        return formatNumber(paidMonths * record.monthlyPrice);
      },
    },
    {
      title: 'Сколько осталось месяцев',
      key: 'remainingMonths',
      render: (_: any, record: Order) => {
        const paidMonths = record.payments
          ? record.payments.filter((p) => p.status === 'success').length
          : 0;
        return record.numberOfMonths - paidMonths;
      },
    },
    {
      title: 'Сколько осталось в сумме',
      key: 'remainingSum',
      render: (_: any, record: Order) => {
        const paidMonths = record.payments
          ? record.payments.filter((p) => p.status === 'success').length
          : 0;
        const remaining = record.numberOfMonths - paidMonths;
        return formatNumber(remaining * record.monthlyPrice);
      },
    },
    {
      title: 'Следующая дата списания',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
      render: (date: string | Date) => formatDate(date),
      // Добавляем фильтр по диапазону дат с помощью RangePicker
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            onChange={(dates, dateStrings) => {
              if (dates) {
                setSelectedKeys(dateStrings);
              } else {
                setSelectedKeys([]);
              }
            }}
            locale={ru_RU.DatePicker}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Фильтр
            </Button>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        // value — массив двух дат (в формате строки)
        if (!value || !Array.isArray(value) || value.length !== 2) return true;
        const [start, end] = value;
        const recordDate = new Date(record.nextBillingDate);
        return recordDate >= new Date(start) && recordDate <= new Date(end);
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    },
    {
      title: 'Имя Фамилия',
      key: 'userName',
      render: (_, record: Order) =>
        record.user ? `${record.user.firstName} ${record.user.lastName}` : '—',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Найти по имени"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Найти
            </Button>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const fullName = record.user
          ? `${record.user.firstName} ${record.user.lastName}`.toLowerCase()
          : '';
        return fullName.includes((value as string).toLowerCase());
      },
    },
    {
      title: 'Телефон',
      dataIndex: ['user', 'phone'],
      key: 'phone',
      render: (phone: string) => phone || '—',
      ...getColumnSearchProps(['user', 'phone']),
    },
    {
      title: 'ИИН',
      dataIndex: ['user', 'iin'],
      key: 'iin',
      render: (iin: string) => iin || '—',
      ...getColumnSearchProps(['user', 'iin']),
    },
  ];

  // --- Expanded row: renders the payments table for the given order ---
  const expandedRowRender = (order: Order) => {
    const allPayments = buildPaymentsArray(order);
    return (
      <div>
        <Title level={5}>Список платежей</Title>
        <Table<Payment>
          columns={paymentColumns}
          dataSource={allPayments}
          pagination={false}
          rowKey={(rec, idx) => (rec.id ? String(rec.id) : `pending-${idx}`)}
        />
      </div>
    );
  };

  return (
    <div className=''>
      <Title level={3}>Подписки на курсы</Title>
      <Table<Order>
        columns={columns}
        dataSource={orders}
        expandable={{ expandedRowRender }}
        rowKey="id"
        className='overflow-x-auto'
      />
    </div>
  );
};

export default OrdersList;