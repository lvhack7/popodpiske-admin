import { FC, useEffect } from 'react'
import { Form, Input, Button, Typography } from 'antd';
import { LoginDto } from '../models/dto/LoginDto';
import { useLoginMutation } from '../api';
import { showNotification } from '../hooks/showNotification';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { adminCreated } from '../redux/adminSlice';

const { Title } = Typography;

const AuthPage: FC = () => {
    const token = localStorage.getItem("access_token")
    const {isLoggedIn} = useAppSelector(state => state.adminReducer)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [login] = useLoginMutation();
    const [form] = Form.useForm<LoginDto>();

    useEffect(() => {
        if (isLoggedIn && token) {
            navigate('/')
        }
    }, [isLoggedIn, token])

    const onFinish = async (values: LoginDto) => {
        try {
            const response = await login(values).unwrap()
            localStorage.setItem("access_token", response?.accessToken)

            dispatch(adminCreated(response.admin))
            navigate("/")
        } catch (e: any) {
            showNotification('error', 'Произошла ошибка', e.data?.message || 'Не предвиденная ошибка, попробуйте позже')
        }
    };

    // Called when there are validation errors
    const onFinishFailed = (errorInfo: any) => {
        console.log('Ошибка валидации:', errorInfo);
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <div className="w-full max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                Авторизация
                </Title>
                <Form
                    form={form}
                    name="loginForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Имя пользователя"
                    name="login"
                    rules={[
                    { required: true, message: 'Пожалуйста, введите имя пользователя' }
                    ]}
                >
                    <Input size='large' placeholder="Введите имя пользователя" />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                    { required: true, message: 'Пожалуйста, введите пароль' }
                    ]}
                >
                    <Input.Password size='large' placeholder="Введите пароль" />
                </Form.Item>

                <Form.Item>
                    <Button className='mt-4' size='large' type="primary" htmlType="submit" block>
                    Войти
                    </Button>
                </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AuthPage