import { Form, Input, Button, Select, Typography, message } from 'antd';
import { FC } from 'react';
import { useGetRolesQuery, useRegisterMutation } from '../api';
import { Role } from '../models/Role';
import { showNotification } from '../hooks/showNotification';

const { Title } = Typography;

const CreateAdmin: FC = () => {
    const [form] = Form.useForm();
    const [register, { isLoading }] = useRegisterMutation();
    const {data: roles} = useGetRolesQuery(undefined, {
        refetchOnMountOrArgChange: true
    })

    const onFinish = async (values: { login: string; password: string; role: string }) => {
        try {
            await register(values).unwrap();
            showNotification('success', 'Админ успешно создан!');
            form.resetFields();
        } catch (e: any) {
            showNotification('error', e?.data?.message || "Непредвиденная ошибка, попробуйте позже")
        }
    };

    return (
        <Form form={form} className='max-w-xl' layout="vertical" onFinish={onFinish}>
            <Title level={3}>Создать админа</Title>
            <Form.Item
                name="login"
                label="Логин"
                rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Пароль"
                rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="role"
                label="Роль"
                rules={[{ required: true, message: 'Пожалуйста, выберите роль!' }]}
            >
                <Select placeholder="Выберите роль">
                    {
                        roles?.map((role: Role) => (
                            <Select.Option value={role.value}>{role.label}</Select.Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" className='mt-3' htmlType="submit" size='large' loading={isLoading}>
                    Создать админа
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateAdmin;