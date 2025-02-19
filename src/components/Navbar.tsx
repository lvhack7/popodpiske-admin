import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { adminClosed } from '../redux/adminSlice';
import { baseApi } from '../api';


const {Title} = Typography

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any authentication tokens or user data here
        localStorage.removeItem('access_token');
        dispatch(adminClosed())
        dispatch(baseApi.util.resetApiState())
        navigate('/auth');
    };

    return (
        <header className='flex items-center justify-between'>
            <Title className='text-blue-500' level={2}>Popodpiske Admin</Title>
            <Button
                type="default"
                className="!bg-red-500 hover:bg-red-200 !border-none !text-white"
                onClick={handleLogout}
            >
                Выйти
            </Button>
        </header>
    );
};

export default Navbar;