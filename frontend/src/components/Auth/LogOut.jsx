import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('employeeId');

    // Optional: clear everything
    // localStorage.clear();

    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null; // Or a loading spinner/message if you want
};

export default LogOut;
