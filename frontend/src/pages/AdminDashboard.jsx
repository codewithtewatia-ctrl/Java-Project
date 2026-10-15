import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { userService as userApi } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  Search, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  UserPlus, 
  Activity,
  Layers,
  TrendingUp,
  Cpu,
  Shield,
  Server
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'TEAM_MEMBER', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, userRes] = await Promise.all([
        dashboardService.getAdminDashboard(),
        userApi.getAllUsers()
      ]);
      if (dashRes.success) setMetrics(dashRes.data);
      if (userRes.success) setUsers(userRes.data);
    } catch (err) {
      showToast('Error loading admin dashboard telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'TEAM_MEMBER', status: 'ACTIVE' });
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
    setIsUserModalOpen(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const payload = { name: formData.name, email: formData.email, role: formData.role, status: formData.status };
        if (formData.password) payload.password = formData.password;
        await userApi.updateUser(editingUser.id, payload);
        showToast('User account updated successfully.', 'success');
      } else {
        await userApi.createUser(formData);
        showToast('User account created successfully.', 'success');
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        await userApi.deleteUser(id);
        showToast('User deleted successfully.', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete user', 'error');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  const roleChartData = metrics?.userRoleDistribution
    ? Object.entries(metrics.userRoleDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const taskChartData = metrics?.taskStatusDistribution
    ? Object.entries(metrics.taskStatusDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), count: value }))
    : [];

  return (
    <div className="space-y-8 animate-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0F172A] to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/15 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
              <Server className="w-3.5 h-3.5 text-indigo-400" /> System Orchestration & Telemetry
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Organization Admin Console</h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Real-time directory controls, role governance, sprint analytics, and organizational cluster health.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Provision New User
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Directory</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.totalUsers || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {metrics?.activeUsers || 0} Enabled Accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Initiatives</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.totalProjects || 0}</h3>
            <p className="text-[11px] text-sky-600 font-semibold mt-1">
              {metrics?.activeProjects || 0} Active / {metrics?.completedProjects || 0} Shipped
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.completedTasks || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {metrics?.totalTasks || 0} Total Work Items
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sprint Backlog</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.pendingTasks || 0}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">In progress & pending QA</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Graphics / Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> User Role Allocation
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">Total: {metrics?.totalUsers || 0}</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} label>
                  {roleChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Work Items Status Velocity
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">Total: {metrics?.totalTasks || 0}</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Organization Directory & Security</h3>
            <p className="text-xs text-slate-500">Manage user accounts, update security roles, and control access permissions.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
              <option value="TEAM_MEMBER">TEAM_MEMBER</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white font-bold flex items-center justify-center shadow-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge type="role" value={u.role} />
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create/Edit Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Provision User Account'}
      >
        <form onSubmit={handleSubmitUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password {editingUser && '(Leave blank to keep unchanged)'}
            </label>
            <input
              type="password"
              required={!editingUser}
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">User Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="TEAM_MEMBER">TEAM_MEMBER</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              {saving ? 'Saving...' : editingUser ? 'Update User' : 'Provision User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
