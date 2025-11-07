import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children, requiredRole }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      if (requiredRole && userData.role !== requiredRole) {
        // User doesn't have required role
        setLoading(false);
        return;
      }
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    
    setLoading(false);
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;

