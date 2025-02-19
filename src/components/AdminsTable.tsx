import React from 'react';
import { Table, Typography } from 'antd';
import { Admin } from '../models/Admin';
import { Role } from '../models/Role';


interface AdminsTableProps {
    admins: Admin[];
}

const AdminsTable: React.FC<AdminsTableProps> = ({ admins }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
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
    ];

    return (
        <div>
          <Typography.Title level={3}>Список админов</Typography.Title>
          <Table dataSource={admins} columns={columns} rowKey="id" />
        </div>
      );
};

export default AdminsTable;