import React, { useState } from 'react';
import { Button, Typography, Modal, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { adminClosed } from '../redux/adminSlice';
import { baseApi } from '../api';
import { useChangePasswordMutation } from '../api'; // Adjust the import based on your file structure
import { showNotification } from '../hooks/showNotification';

const { Title } = Typography;

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [changePassword] = useChangePasswordMutation();

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.removeItem('access_token');
    dispatch(adminClosed());
    dispatch(baseApi.util.resetApiState());
    navigate('/auth');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
        const values = await form.validateFields();
        await changePassword(values).unwrap();
        showNotification('success', 'Пароль успешно изменен!');
        setIsModalVisible(false);
    } catch (e: any) {
        showNotification('error', e?.data.message || 'Не удалось изменить пароль.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <header className='flex items-center justify-between'>
      <Title className='text-blue-500' level={2}>Popodpiske Admin</Title>
      <div className='flex items-center space-x-3'>
        <Button
          type="default"
          className="!bg-blue-500 hover:bg-blue-200 !border-none !text-white mr-2"
          onClick={showModal}
        >
          Изменить пароль
        </Button>
        <Button
          type="default"
          className="!bg-red-500 hover:bg-red-200 !border-none !text-white"
          onClick={handleLogout}
        >
          Выйти
        </Button>
      </div>
      <Modal
        title="Изменить пароль"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Старый пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите старый пароль!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[{ required: true, message: 'Пожалуйста, введите новый пароль!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </header>
  );
};

export default Navbar;