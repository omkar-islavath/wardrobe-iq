import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Calendar,
  User,
  ShoppingBag,
  Luggage,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkle
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Wardrobe', path: '/wardrobe', icon: Shirt },
    { name: 'Outfit Generator', path: '/generate-outfits', icon: Sparkles },
    { name: 'Outfit History', path: '/history', icon: Calendar },
    { name: 'Shopping Assistant', path: '/shopping', icon: ShoppingBag },
    { name: 'Packing Assistant', path: '/packing', icon: Luggage },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getProfileImage = (photo) => {
    if (!photo) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';
    if (photo.startsWith('http')) return photo;
    // Serve from backend
    return `${API_URL.replace('/api', '')}${photo}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-850 glass-panel fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-850">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
            <Sparkle className="w-6 h-6 animate-pulse-slow fill-indigo-400 dark:fill-indigo-500 text-indigo-600 dark:text-indigo-400" />
            <span>Wardrobe<span className="text-purple-600 dark:text-purple-400">IQ</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-850">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-850 glass-panel sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold capitalize hidden sm:block">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-850">
              <Link to="/settings" className="flex items-center gap-3">
                <img
                  src={getProfileImage(user?.profilePhoto)}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/30"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-none">Style: {user?.styleProfile?.preferredStyle || 'Casual'}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 h-full z-45 transition-transform duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-850">
              <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                <Sparkle className="w-6 h-6 fill-indigo-400 text-indigo-600 dark:text-indigo-400" />
                <span>Wardrobe<span className="text-purple-600 dark:text-purple-400">IQ</span></span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-850">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;
