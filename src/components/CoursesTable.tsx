import React from 'react';
import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Course } from '../models/Course';
import { formatNumber } from '../utils';

interface CourseProps {
    courses: Course[]
}

const columns: ColumnsType<Course> = [
  {
    title: 'Название курса',
    dataIndex: 'courseName',
    key: 'courseName',
  },
  {
    title: 'Общая цена (KZT)',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: (price: number) => formatNumber(price),
  },
];

const CoursesTable: React.FC<CourseProps> = ({ courses }) => {
  return (
    <div>
      <Typography.Title level={3}>Список курсов</Typography.Title>
      <Table columns={columns} dataSource={courses} rowKey="id" />
    </div>
  );
};

export default CoursesTable;