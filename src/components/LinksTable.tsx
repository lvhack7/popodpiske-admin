import { Link } from "../models/Link";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Order from "../models/Order";
import Table, { ColumnsType } from "antd/es/table";
import { Course } from "../models/Course";
import { Admin } from "../models/Admin";
import { Typography } from "antd";

dayjs.locale('ru');

interface LinksTableProps {
    links: Link[];
    showAdminName?: boolean
}

const LinksTable: React.FC<LinksTableProps> = ({ links, showAdminName = false }) => {
    const columns: ColumnsType<Link> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Название курса',
        dataIndex: 'course',
        key: 'courseName',
        render: (course: Course | null) => course?.courseName,
      },
      {
        title: 'Номер подписки',
        dataIndex: 'order',
        key: 'orderId',
        render: (order: Order | null) => order ? order.id : 'Нет данных',
      },
      {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: string) => new Date(createdAt).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Detects browser timezone
        }),
      },
    ];

    if (showAdminName) {
      columns.splice(3, 0, {
        title: 'Кем создано',
        dataIndex: 'admin',
        key: 'adminName',
        render: (admin: Admin) => admin.login,
      });
    }
  
    return (
      <div>
        <Typography.Title level={3}>Список ссылок</Typography.Title>
        <Table className="overflow-x-auto" columns={columns} dataSource={links} rowKey="id" />
      </div>
    );
};
  
export default LinksTable;