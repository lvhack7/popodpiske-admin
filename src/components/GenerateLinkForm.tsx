import { FC, useState } from 'react';
import { Form, Input, Button, message, Select, Typography } from 'antd';
import { useGenerateLinkMutation } from '../api'; // Adjust the import based on your file structure
import { Course } from '../models/Course';

const { Title } = Typography

interface GenerateLinkFormProps {
    courses: Course[]
}

const GenerateLinkForm: FC<GenerateLinkFormProps> = ({ courses }) => {
    const [form] = Form.useForm();
    const [generateLink, { isLoading }] = useGenerateLinkMutation();
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const onFinish = async (values: { courseId: number, monthsArray: number[] }) => {
        try {
            const response = await generateLink(values).unwrap();
            setGeneratedLink(response.link);
            message.success('Ссылка успешно сгенерирована!');
        } catch (error) {
            message.error('Не удалось сгенерировать ссылку.');
        }
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            message.success('Ссылка скопирована в буфер обмена!');
        }
    };

    return (
        <Form form={form} className='max-w-xl' layout="vertical" onFinish={onFinish}>
            <Title level={3}>Создать ссылку на подписку</Title>
            <Form.Item
                name="courseId"
                className='mt-6'
                label="Выберите курс"
                rules={[{ required: true, message: 'Пожалуйста, выберите курс!' }]}
            >
                <Select placeholder="Выберите курс" size='large'>
                    {courses.map(course => (
                        <Select.Option key={course.id} value={course.id}>
                            {course.courseName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="monthsArray"
                label="Выберите месяцы"
                rules={[{ required: true, message: 'Пожалуйста, выберите месяцы!' }]}
            >
                <Select mode="multiple" placeholder="Выберите месяцы" size='large'>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <Select.Option key={month} value={month}>
                    {month}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" className='mt-3' htmlType="submit" size='large' loading={isLoading}>
                    Сгенерировать ссылку
                </Button>
            </Form.Item>
            {generatedLink && (
                <Form.Item label="Сгенерированная ссылка">
                    <Input.Group compact>
                        <Input value={generatedLink} readOnly />
                        <Button onClick={copyToClipboard}>Копировать</Button>
                    </Input.Group>
                </Form.Item>
            )}
        </Form>
    );
};

export default GenerateLinkForm;