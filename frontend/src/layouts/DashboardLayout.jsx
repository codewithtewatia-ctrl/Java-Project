import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Derive human readable page titles
  const getPageTitle = (pathname) => {
    if (pathname.includes('/projects')) return 'Projects Directory';
    if (pathname.includes('/tasks')) return 'Task Management';
    if (pathname.includes('/team')) return 'Team & Workload';
    if (pathname.includes('/reports')) return 'Performance Analytics';
    if (pathname.includes('/profile')) return 'Personal Profile';
    if (pathname.includes('/settings')) return 'System Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar isCollapsed={false} toggleSidebar={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Navbar
          pageTitle={getPageTitle(location.pathname)}
          toggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
