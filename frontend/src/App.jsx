import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Mentor from './pages/Mentor';
import Notifications from './pages/Notifications';
import AdminEnhanced from './pages/AdminEnhanced';
import Clubs from './pages/Clubs';
import Holidays from './pages/Holidays';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Assignments from './pages/Assignments';
import Sessions from './pages/Sessions';
import MentorDashboard from './pages/MentorDashboard';
import StudentPerformance from './pages/StudentPerformance';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHomePath = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'mentor') return '/mentor';
    return '/dashboard';
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/landing';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/landing"
            element={<Landing />}
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to={getHomePath(user.role)} replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to={getHomePath(user.role)} replace /> : <Register onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : user?.role === 'mentor' ? (
                  <Navigate to="/mentor" replace />
                ) : (
                  <Dashboard user={user} onLogout={handleLogout} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                {user?.role === 'mentor' ? (
                  <MentorDashboard user={user} onLogout={handleLogout} />
                ) : user?.role === 'student' ? (
                  <Mentor user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to={getHomePath(user.role)} replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEnhanced user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <Clubs user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holidays"
            element={
              <ProtectedRoute>
                <Holidays user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Assignments user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <Sessions user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student-performance/:studentId"
            element={
              <ProtectedRoute requiredRole="admin">
                <StudentPerformance user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={user ? <Navigate to={getHomePath(user.role)} replace /> : <Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

