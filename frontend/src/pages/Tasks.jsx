import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Calendar, 
  AlertCircle,
  LayoutGrid,
  List,
  Filter,
  Flame,
  Clock,
  CircleDot,
  CheckCircle2,
  Tag,
  ArrowRight,
  MoreVertical,
  HelpCircle
} from 'lucide-react';

export const Tasks = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state: 'kanban' or 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    startDate: '',
    dueDate: '',
  });
  const [saving, setSaving] = useState(false);

  const canManageTasks = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        taskService.getAllTasks(),
        projectService.getProjects(),
        userService.getAllUsers(),
      ]);
      if (taskRes.success) setTasks(taskRes.data);
      if (projRes.success) setProjects(projRes.data);
      if (userRes.success) setTeamMembers(userRes.data);
    } catch (err) {
      showToast('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: '',
      priority: 'MEDIUM',
      status: 'TODO',
      startDate: '',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTask(t);
    setFormData({
      title: t.title,
      description: t.description || '',
      projectId: t.projectId,
      assigneeId: t.assignee?.id || '',
      priority: t.priority,
      status: t.status,
      startDate: t.startDate || '',
      dueDate: t.dueDate || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenAssignModal = (t) => {
    setSelectedTaskId(t.id);
    setSelectedAssigneeId(t.assignee?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
        showToast('Task updated successfully.', 'success');
      } else {
        await taskService.createTask(formData);
        showToast('Task created successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Task operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssigneeId) {
      showToast('Please select a team member', 'error');
      return;
    }
    setSaving(true);
    try {
      await taskService.assignTask(selectedTaskId, selectedAssigneeId);
      showToast('Task assigned successfully.', 'success');
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to assign task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      showToast('Task status updated successfully.', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete task "${title}"?`)) {
      try {
        await taskService.deleteTask(id);
        showToast('Task deleted successfully.', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete task', 'error');
      }
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProject = projectFilter === 'ALL' || t.projectId === Number(projectFilter);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    if (user?.role === 'TEAM_MEMBER') {
      return matchesSearch && matchesProject && matchesStatus && matchesPriority && t.assignee?.id === user.id;
    }

    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const getCategoryTag = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('ui') || lower.includes('design') || lower.includes('checkout')) return { label: 'Design', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (lower.includes('api') || lower.includes('gateway') || lower.includes('stripe')) return { label: 'Payments', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (lower.includes('test') || lower.includes('qa') || lower.includes('security')) return { label: 'QA & Sec', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (lower.includes('database') || lower.includes('index') || lower.includes('auth')) return { label: 'Backend', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    return { label: 'Core', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const kanbanColumns = [
    { key: 'TODO', label: 'To Do', icon: CircleDot, color: 'text-slate-500', count: filteredTasks.filter(t => t.status === 'TODO').length },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'text-amber-500', count: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length },
    { key: 'REVIEW', label: 'In Review', icon: HelpCircle, color: 'text-purple-500', count: filteredTasks.filter(t => t.status === 'REVIEW').length },
    { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', count: filteredTasks.filter(t => t.status === 'COMPLETED').length },
  ];

  if (loading) return <LoadingSkeleton count={4} type="table" />;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Task & Sprint Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track deliverables, assign task owners, and manage sprint progress.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* View Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table Grid
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {canManageTasks && (
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {kanbanColumns.map((col) => {
            const ColumnIcon = col.icon;
            const columnTasks = filteredTasks.filter((t) => t.status === col.key);

            return (
              <div key={col.key} className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <ColumnIcon className={`w-4 h-4 ${col.color}`} />
                    <h3 className="text-xs font-extrabold text-slate-800 tracking-tight">{col.label}</h3>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    {col.count}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                  {columnTasks.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      No tasks in this lane
                    </div>
                  ) : (
                    columnTasks.map((t) => {
                      const tag = getCategoryTag(t.title);
                      return (
                        <div
                          key={t.id}
                          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tag.bg}`}>
                              {tag.label}
                            </span>
                            <StatusBadge type="priority" value={t.priority} />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                              {t.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {t.description || 'No description added.'}
                            </p>
                          </div>

                          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {t.projectTitle}
                          </div>

                          {/* Footer with Assignee & Due Date */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                                {t.assignee ? t.assignee.name.charAt(0) : '?'}
                              </div>
                              <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[85px]">
                                {t.assignee ? t.assignee.name.split(' ')[0] : 'Unassigned'}
                              </span>
                            </div>

                            {t.dueDate && (
                              <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                                t.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {t.dueDate}
                              </span>
                            )}
                          </div>

                          {/* Quick lane transition buttons */}
                          <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between">
                            <select
                              value={t.status}
                              onChange={(e) => handleQuickStatusChange(t.id, e.target.value)}
                              className="text-[10px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="REVIEW">Review</option>
                              <option value="COMPLETED">Completed</option>
                            </select>

                            {canManageTasks && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEditModal(t)}
                                  className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(t.id, t.title)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW B: TABLE GRID VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4">Task Details</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 max-w-xs">
                        <p className="font-bold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{t.description}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{t.projectTitle}</td>
                      <td className="p-4">
                        {t.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                              {t.assignee.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-800">{t.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <StatusBadge type="priority" value={t.priority} />
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {t.dueDate ? (
                          <span className={`inline-flex items-center gap-1 ${t.isOverdue ? 'text-rose-600 font-bold' : ''}`}>
                            <Calendar className="w-3.5 h-3.5" /> {t.dueDate}
                            {t.isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleQuickStatusChange(t.id, e.target.value)}
                          className="text-xs py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="REVIEW">REVIEW</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManageTasks && (
                            <>
                              <button
                                onClick={() => handleOpenAssignModal(t)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Assign User"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(t)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Task"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(t.id, t.title)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task Deliverable' : 'Create Task Deliverable'}
      >
        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement Webhook retry mechanism"
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide technical scope and acceptance criteria..."
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
              <select
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="COMPLETED">COMPLETED</option>
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
              {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Task Responsibility"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Assignee</label>
            <select
              required
              value={selectedAssigneeId}
              onChange={(e) => setSelectedAssigneeId(e.target.value)}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select team member...</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              {saving ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
