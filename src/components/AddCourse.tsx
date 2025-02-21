import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useAddCourseMutation } from '../api';
import { showNotification } from '../hooks/showNotification';


const {Title} = Typography

const AddCourse: React.FC = () => {
    const [form] = Form.useForm();
    const [addCourse] = useAddCourseMutation()

    const onFinish = async (values: any) => {
        try {
            await addCourse({ ...values, totalPrice: Number(values.totalPrice) }).unwrap()
            showNotification("success", "Курс был добавлен") 
            form.resetFields()
        } catch(e: any) {
            showNotification("error", e?.data?.message || "Произошла ошибка")
        }
    };


    return (
        <Form
            name="add_course"
            className='max-w-xl'
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout='vertical'
        >
        <Title level={3}>Добавить новый курс</Title>
        <Form.Item
            label="Название курса"
            name="courseName"
            rules={[{ required: true, message: 'Пожалуйста, введите название курса!' }]}
        >
            <Input size='large' />
        </Form.Item>

        <Form.Item
            label="Общая цена"
            name="totalPrice"
            rules={[{ required: true, message: 'Пожалуйста, введите общую цену!' }]}
        >
            <Input size='large' type="number" placeholder="Введите общую стоимость" />
        </Form.Item>

        <Form.Item>
            <Button size='large' type="primary" htmlType="submit">
                Создать курс
            </Button>
        </Form.Item>
        </Form>
    );
};

export default AddCourse;