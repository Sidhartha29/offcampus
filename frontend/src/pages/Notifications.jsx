import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import NotificationCard from '../components/NotificationCard';
import { Bell, CheckCircle, Filter } from 'lucide-react';

function Notifications({ user, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'unread') params.append('status', 'unread');
      if (filter === 'read') params.append('status', 'read');

      const queryString = params.toString();
      const response = await api.get(`/notification${queryString ? `?${queryString}` : ''}`);
      const items = response.data.notifications || [];
      setNotifications(items);
      setUnreadCount(response.data.unreadCount ?? 0);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notification/actions/mark-all-read');
      toast.success('All notifications marked as read');
      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, read: true }
            : item
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Notifications</h1>
            <p className="text-white/80 text-sm sm:text-base">Stay updated with important alerts tailored to your role</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg">
              <Filter className="w-4 h-4 text-purple-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => {
                  setLoading(true);
                  setFilter(e.target.value);
                }}
                className="bg-transparent text-sm font-semibold text-purple-700 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-white text-purple-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, idx) => (
                <NotificationCard
                  key={notification._id || idx}
                  notification={notification}
                  onMarkRead={() => !notification.read && handleMarkRead(notification._id)}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

