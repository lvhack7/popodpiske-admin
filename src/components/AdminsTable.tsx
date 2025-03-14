import React from 'react';
import { Table, Typography, Button, Popconfirm } from 'antd';
import { Admin } from '../models/Admin';
import { Role } from '../models/Role';
import { useRemoveAdminMutation } from '../api';
import { showNotification } from '../hooks/showNotification';

interface AdminsTableProps {
  admins: Admin[];
}

const AdminsTable: React.FC<AdminsTableProps> = ({ admins }) => {
  const [deleteAdmin] = useRemoveAdminMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteAdmin(id).unwrap();
      showNotification('success', 'Админ успешно удален!');
    } catch (error: any) {
      showNotification('error', error?.data?.message || 'Непредвиденная ошибка, попробуйте позже');
    }
  };

  const columns = [
    {
        title: 'ID',
        key: 'id',
        render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: Role[]) => roles.map((role: Role) => role.label).join(', '),
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_: any, record: Admin) => (
        <Popconfirm
          title="Вы уверены, что хотите удалить этого админа?"
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="link" danger>
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Список админов</Typography.Title>
      <Table dataSource={admins} columns={columns} rowKey="id"
      pagination={{
        onChange: (page, pageSize) => {
          columns[0].render = (_: any, __: any, index: number) => (page - 1) * pageSize + index + 1;
        },
      }}
      />
    </div>
  );
};

export default AdminsTable;