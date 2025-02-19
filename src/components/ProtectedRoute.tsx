import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem('access_token');
  const { admin, isLoggedIn } = useAppSelector(state => state.adminReducer);

  if (!isLoggedIn || !token) {
    return <Navigate to="/auth" replace />;
  }

  if (role && !admin.roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;