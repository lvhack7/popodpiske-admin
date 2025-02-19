import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector } from './hooks/redux';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import { FC } from 'react';


const App: FC = () => {
  const token = localStorage.getItem('access_token');
  const { admin, isLoggedIn } = useAppSelector(state => state.adminReducer);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<AuthPage />} />
        <Route path="admin" element={
          <ProtectedRoute role='ADMIN'>
            <AdminPage/>
          </ProtectedRoute>
        } />
        <Route path="manager" element={
          <ProtectedRoute role='MANAGER'>
            <ManagerPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          isLoggedIn && token ? (
            admin.roles.includes("ADMIN") ? <Navigate to="/admin" replace /> : <Navigate to="/manager" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;