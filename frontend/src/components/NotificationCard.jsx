import { Bell, AlertCircle, Info, Calendar, CalendarCheck, UserPlus, ClipboardList, Megaphone } from 'lucide-react';

function NotificationCard({ notification, onMarkRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'class':
      case 'timetable':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'transport':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'event':
        return <Bell className="w-5 h-5 text-purple-600" />;
      case 'holiday':
        return <CalendarCheck className="w-5 h-5 text-emerald-600" />;
      case 'club':
        return <UserPlus className="w-5 h-5 text-pink-600" />;
      case 'assignment':
        return <ClipboardList className="w-5 h-5 text-indigo-600" />;
      case 'mentor':
        return <Megaphone className="w-5 h-5 text-teal-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'class':
      case 'timetable':
        return 'bg-blue-50 border-blue-200';
      case 'transport':
        return 'bg-orange-50 border-orange-200';
      case 'event':
        return 'bg-purple-50 border-purple-200';
      case 'holiday':
        return 'bg-emerald-50 border-emerald-200';
      case 'club':
        return 'bg-pink-50 border-pink-200';
      case 'assignment':
        return 'bg-indigo-50 border-indigo-200';
      case 'mentor':
        return 'bg-teal-50 border-teal-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`${getBgColor()} rounded-lg p-4 border-l-4 transition-all ${notification.read ? 'opacity-80' : 'shadow-md'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{notification.title}</h3>
              {notification.body && (
                <p className="text-sm text-gray-600 whitespace-pre-line break-words">{notification.body}</p>
              )}
            </div>
            {!notification.read && (
              <button
                onClick={onMarkRead}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Mark read
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
            <span className="capitalize">{notification.type || 'general'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;

