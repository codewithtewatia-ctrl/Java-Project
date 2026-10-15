import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { projectService as projApi } from '../services/projectService';
import { taskService as taskApi } from '../services/taskService';
import { userService as userApi } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  FolderKanban, 
  CheckSquare, 
  Plus, 
  Clock, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles,
  Flame,
  Activity,
  ArrowRight
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

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const ManagerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', startDate: '', endDate: '', status: 'PLANNING' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', status: 'TODO', startDate: '', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, projRes, userRes] = await Promise.all([
        dashboardService.getManagerDashboard(),
        projApi.getProjects(),
        userApi.getAllUsers()
      ]);
      if (dashRes.success) setMetrics(dashRes.data);
      if (projRes.success) setProjects(projRes.data);
      if (userRes.success) setTeamMembers(userRes.data);
    } catch (err) {
      showToast('Error loading manager dashboard telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projApi.createProject(projectForm);
      showToast('Project created successfully.', 'success');
      setIsProjectModalOpen(false);
      setProjectForm({ title: '', description: '', startDate: '', endDate: '', status: 'PLANNING' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskApi.createTask(taskForm);
      showToast('Task assigned successfully.', 'success');
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', status: 'TODO', startDate: '', dueDate: '' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  const statusPieData = metrics?.taskStatusBreakdown
    ? Object.entries(metrics.taskStatusBreakdown).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const workloadData = metrics?.teamWorkload
    ? Object.entries(metrics.teamWorkload).map(([name, count]) => ({ name, tasks: count }))
    : [];

  return (
    <div className="space-y-8 animate-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-indigo-900/50">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Engineering Project Lead
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sprint Delivery & Monitoring</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
            Oversee product roadmaps, balance engineer workloads, and ensure on-time feature delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 flex-shrink-0">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-600" /> New Project
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-indigo-500/40"
          >
            <CheckSquare className="w-4 h-4" /> Assign Task
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Managed Initiatives</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.totalManagedProjects || 0}</h3>
            <p className="text-[11px] text-sky-600 font-semibold mt-1">{metrics?.activeProjects || 0} Active Sprints</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Milestone Progress</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {metrics?.overallCompletionRate ? metrics.overallCompletionRate.toFixed(0) : 0}%
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {metrics?.completedTasks || 0} / {metrics?.totalTasks || 0} Delivered
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In-Flight Tasks</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.inProgressTasks || 0}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Active sprint execution</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blockers & Overdue</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.overdueTasks || 0}</h3>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">Past target deadline</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Deliverables Breakdown
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">Current Sprint</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} label>
                  {statusPieData.map((_, index) => (
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
              <Users className="w-4 h-4 text-emerald-600" /> Engineer Load Distribution
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">By Assignee</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="tasks" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Managed Projects List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Active Sprints & Roadmaps</h3>
          <span className="text-xs text-slate-500 font-semibold">{projects.length} Total Projects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/40 space-y-4 card-hover-effect">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                </div>
                <StatusBadge type="projectStatus" value={p.status} />
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Milestone Health</span>
                  <span className="text-indigo-600 font-extrabold">{p.progress || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${p.progress || 0}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {p.endDate || 'TBD'}
                </span>
                <span className="font-bold text-slate-800">
                  {p.completedTasks}/{p.totalTasks} Done
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal A: Create Project */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Initialize Project Initiative">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initiative Title</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="PLANNING">PLANNING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              {submitting ? 'Creating...' : 'Launch Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal B: Create and Assign Task */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Assign Sprint Deliverable">
        <form onSubmit={handleAssignTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Description</label>
            <textarea
              rows={2}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Project</label>
              <select
                required
                value={taskForm.projectId}
                onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Engineer</label>
              <select
                value={taskForm.assigneeId}
                onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select team member...</option>
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
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
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
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
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
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              {submitting ? 'Assigning...' : 'Assign Deliverable'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
