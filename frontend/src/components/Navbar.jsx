import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/extraServices';
import { StatusBadge } from './StatusBadge';
import { 
  Bell, 
  Search, 
  CheckCheck, 
  Menu, 
  Command, 
  Layers, 
  ChevronDown, 
  Sparkles,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';

export const Navbar = ({ pageTitle, toggleMobileSidebar, onOpenQuickTask }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getUserNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
      const countRes = await notificationService.getUnreadCount();
      if (countRes.success) {
        setUnreadCount(countRes.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Mobile toggle + Breadcrumb / Active Context */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Workspace</span>
            <span>/</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {pageTitle || 'Dashboard'}
          </h1>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sprint 24 Live
          </span>
        </div>
      </div>

      {/* Right: Global Search command + Notifications + User Avatar */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Global Search with ⌘K Badge */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Type to search tasks, projects..."
            className="w-64 lg:w-72 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-9 pr-14 py-2 rounded-xl border border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-500">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-slate-200/80 overflow-hidden z-50 animate-in">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <p className="font-semibold text-slate-600 mb-1">You're all caught up!</p>
                    No new alerts or task notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkAsRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-bold text-slate-900 text-xs truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill / Profile Menu */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-black text-xs flex items-center justify-center shadow-xs uppercase tracking-tight">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">{user?.name}</p>
            <p className="text-[10px] font-semibold text-slate-400 capitalize">
              {user?.role ? user.role.toLowerCase().replace('_', ' ') : 'Member'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
