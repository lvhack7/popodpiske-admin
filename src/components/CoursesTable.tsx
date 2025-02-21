import React, { useState } from 'react';
import { Table, Typography, Button, Modal, Form, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Course } from '../models/Course';
import { formatNumber } from '../utils';
import { useUpdateCourseMutation } from '../api';
import { showNotification } from '../hooks/showNotification';

interface CourseProps {
  courses: Course[];
  editable?: boolean
}

const CoursesTable: React.FC<CourseProps> = ({ courses, editable = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [form] = Form.useForm();
  const [updateCourse] = useUpdateCourseMutation();

  const showModal = (course: Course) => {
    setCurrentCourse(course);
    form.setFieldsValue(course);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateCourse({ id: currentCourse.id, courseName: values.courseName, totalPrice: Number(values.totalPrice) }).unwrap();
      setIsModalVisible(false);
    } catch (e: any) {
      showNotification("error", e?.data?.message || "Непредвиденная ошибка, попробуйте позже")
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Course> = [
    {
      title: 'ID',
      key: 'id',
      render: (_: any, __: any, index: number) => index + 1,
    },
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

  if (editable) {
    columns.push({
      title: 'Действия',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record: Course) => (
        <Button type='link' onClick={() => showModal(record)}>Изменить</Button>
      ),
    });
  }

  return (
    <div className='flex flex-col space-y-1'>
      <Typography.Title level={3}>Список курсов</Typography.Title>
      <Table
        dataSource={courses}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title="Изменить курс"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="courseName"
            label="Название курса"
            rules={[{ required: true, message: 'Пожалуйста, введите название курса!' }]}
          >
            <Input size='large' />
          </Form.Item>
          <Form.Item
            name="totalPrice"
            label="Общая цена (KZT)"
            rules={[{ required: true, message: 'Пожалуйста, введите общую цену!' }]}
          >
            <Input type="number" size='large' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};  
export default CoursesTable;