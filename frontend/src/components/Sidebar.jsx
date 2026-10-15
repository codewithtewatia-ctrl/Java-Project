import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  UserCircle, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Building2,
  ChevronDown,
  Layers,
  Flame,
  Plus
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Projects', path: '/projects', icon: FolderKanban },
        { label: 'Tasks & Sprints', path: '/tasks', icon: CheckSquare },
      ]
    },
    {
      group: 'COLLABORATION',
      items: [
        { label: 'Team & Workload', path: '/team', icon: Users },
        { label: 'Executive Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'PROJECT_MANAGER'] },
      ]
    },
    {
      group: 'PREFERENCES',
      items: [
        { label: 'My Profile', path: '/profile', icon: UserCircle },
        { label: 'System Settings', path: '/settings', icon: Settings, roles: ['ADMIN'] },
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0B0F19] text-slate-300 border-r border-slate-800/80 transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top: Workspace Switcher Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0 font-extrabold text-sm">
              PF
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                  ProjectFlow
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] text-slate-400 truncate">Engineering Hub</span>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Workspace Pill */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                AC
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">Acme Global</p>
                <p className="text-[10px] text-slate-400">Production Sprint</p>
              </div>
            </div>
            <StatusBadge type="role" value={user?.role} />
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="p-3 space-y-5 overflow-y-auto custom-scrollbar max-h-[calc(100vh-250px)]">
          {navGroups.map((g, gIdx) => {
            const filteredItems = g.items.filter((item) => {
              if (!item.roles) return true;
              return item.roles.includes(user?.role);
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1">
                    {g.group}
                  </p>
                )}
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all relative ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Sprint Progress Gauge & User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Sprint 24 Health
              </span>
              <span className="text-emerald-400">84%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full" style={{ width: '84%' }} />
            </div>
            <p className="text-[10px] text-slate-400">4 days remaining in cycle</p>
          </div>
        )}

        {/* User Card & Logout */}
        <div className="flex items-center justify-between">
          {!isCollapsed && user && (
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-950/30 transition-colors ${
              isCollapsed ? 'w-full flex justify-center' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
