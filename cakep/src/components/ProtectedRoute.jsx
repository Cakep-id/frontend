import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    // Jika tidak ada token atau role tidak sesuai, redirect ke login
    if (!userToken || !userRole) {
      navigate('/login');
      return;
    }

    // Jika ada required role, pastikan role user sesuai
    if (requiredRole && userRole !== requiredRole) {
      // Redirect ke halaman yang sesuai dengan role user
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'user') {
        navigate('/user');
      } else if (userRole === 'train') {
        navigate('/train');
      } else {
        navigate('/login');
      }
      return;
    }
  }, [navigate, requiredRole]);

  const userToken = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');

  // Render children jika user sudah login dan role sesuai
  if (userToken && userRole && (!requiredRole || userRole === requiredRole)) {
    return children;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;
