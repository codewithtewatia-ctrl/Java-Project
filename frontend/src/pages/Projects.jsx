import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const Projects = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNING',
    projectManagerId: '',
  });
  const [saving, setSaving] = useState(false);

  const canManageProjects = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, userRes] = await Promise.all([
        projectService.getProjects(),
        userService.getAllUsers(),
      ]);
      if (projRes.success) setProjects(projRes.data);
      if (userRes.success) setManagers(userRes.data.filter((u) => u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN'));
    } catch (err) {
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'PLANNING',
      projectManagerId: user?.role === 'PROJECT_MANAGER' ? user.id : '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      status: p.status,
      projectManagerId: p.projectManager?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
        showToast('Project updated successfully.', 'success');
      } else {
        await projectService.createProject(formData);
        showToast('Project created successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      try {
        await projectService.deleteProject(id);
        showToast('Project deleted successfully.', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete project', 'error');
      }
    }
  };

  const getDomainTag = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('commerce') || lower.includes('retail')) return 'E-Commerce / Fintech';
    if (lower.includes('bank') || lower.includes('mobile')) return 'Mobile / Security';
    if (lower.includes('college') || lower.includes('management')) return 'Enterprise ERP';
    if (lower.includes('ai') || lower.includes('bot')) return 'Generative AI';
    return 'Software Engineering';
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Projects & Roadmaps</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enterprise initiatives, milestones, and deliverables portfolio.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search initiatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNING">PLANNING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_HOLD">ON_HOLD</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {canManageProjects && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Initiative
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl text-center text-slate-400 border border-slate-200">
            No projects found matching the filter criteria.
          </div>
        ) : (
          filteredProjects.map((p) => {
            const domain = getDomainTag(p.title);
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      {domain}
                    </span>
                    <StatusBadge type="projectStatus" value={p.status} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                      {p.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Progress Meter */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-indigo-500" /> Milestone Completion
                      </span>
                      <span className="text-indigo-600 font-extrabold">{p.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-sky-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <User className="w-3.5 h-3.5" /> Project Owner:
                      </span>
                      <span className="font-bold text-slate-800">{p.projectManager?.name || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> Target Deadline:
                      </span>
                      <span className="font-bold text-slate-800">{p.endDate || 'No Target'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Deliverables:
                      </span>
                      <span className="font-bold text-slate-800">
                        {p.completedTasks} / {p.totalTasks} Finished
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {canManageProjects && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Scope
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Initiative Roadmap' : 'Initialize New Initiative'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initiative Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Next-Gen Mobile Banking Core"
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline project business objectives and high-level deliverables..."
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date / Target</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Manager</label>
              <select
                value={formData.projectManagerId}
                onChange={(e) => setFormData({ ...formData, projectManagerId: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Project Manager...</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="PLANNING">PLANNING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              {saving ? 'Saving...' : editingProject ? 'Update Initiative' : 'Launch Initiative'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
