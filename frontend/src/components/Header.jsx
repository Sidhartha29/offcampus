import { Link, NavLink } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  LogOut,
  Home,
  CalendarDays,
  Users,
  Bell,
  Shield,
  UserPlus,
  BookOpen,
  CalendarCheck,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navByRole = {
  student: [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/assignments', label: 'Assignments', icon: BookOpen },
    { to: '/sessions', label: 'Sessions', icon: CalendarCheck },
    { to: '/mentor', label: 'Mentor', icon: Users },
    { to: '/bookings', label: 'Bookings', icon: ClipboardList },
    { to: '/clubs', label: 'Clubs', icon: UserPlus },
    { to: '/holidays', label: 'Holidays', icon: CalendarDays },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  mentor: [
    { to: '/mentor', label: 'Mentor Home', icon: Home },
    { to: '/assignments', label: 'Assignments', icon: BookOpen },
    { to: '/sessions', label: 'Sessions', icon: CalendarCheck },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  admin: [
    { to: '/admin', label: 'Admin Console', icon: Shield },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  default: [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ]
};

function Header({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (!user?.role) return navByRole.default;
    return navByRole[user.role] || navByRole.default;
  }, [user?.role]);

  const handleToggle = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <Link to="/dashboard" className="flex items-center space-x-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
                Off-Campus Support
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSwitcher />
            <Link
              to="/profile"
              className="hidden md:flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:flex flex-col max-w-[140px]">
                <span className="text-sm font-semibold text-gray-800 truncate">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize truncate">{user?.role}</span>
              </div>
            </Link>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <button
              onClick={handleToggle}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  closeMobile();
                  onLogout();
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

