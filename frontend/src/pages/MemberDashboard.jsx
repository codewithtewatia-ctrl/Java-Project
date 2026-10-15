import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { taskService as taskApi } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  FolderKanban, 
  CheckCircle2, 
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const MemberDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getMemberDashboard();
      if (res.success) setMetrics(res.data);
    } catch (err) {
      showToast('Error loading personal workspace telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast('Task status updated successfully.', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update task status', 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) return <LoadingSkeleton count={3} type="card" />;

  return (
    <div className="space-y-8 animate-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-teal-900/50">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
            <Target className="w-3.5 h-3.5 text-teal-400" /> Engineer Workspace & Sprint Cadence
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Assigned Deliverables & Sprints</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
            Update your task status in real time to automatically synchronize milestone progress with your project manager.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center flex-shrink-0">
          <p className="text-[10px] text-teal-300 font-extrabold uppercase tracking-wider">My Velocity</p>
          <h3 className="text-3xl font-black text-white mt-0.5">
            {metrics?.completionPercentage ? metrics.completionPercentage.toFixed(0) : 0}%
          </h3>
          <p className="text-[10px] text-slate-300 mt-1">SLA On-Track</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Backlog</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.assignedTasksCount || 0}</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Active items allocated</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipped Items</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.completedTasksCount || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified & completed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.inProgressTasksCount || 0}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Under active development</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between card-hover-effect">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Teams</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{metrics?.assignedProjectsCount || 0}</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Project repositories</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Sprint Tasks Assigned To Me</h3>
            <p className="text-xs text-slate-500">Update status instantly to reflect live progress in manager sprint reports.</p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Task Details</th>
                <th className="p-4">Project</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Target Due</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {metrics?.myTasks?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No tasks assigned to your queue at the moment.
                  </td>
                </tr>
              ) : (
                metrics?.myTasks?.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{t.description}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{t.projectTitle}</td>
                    <td className="p-4">
                      <StatusBadge type="priority" value={t.priority} />
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {t.dueDate ? (
                        <span className={`inline-flex items-center gap-1 ${t.isOverdue ? 'text-rose-600 font-bold' : ''}`}>
                          <Calendar className="w-3.5 h-3.5" /> {t.dueDate}
                          {t.isOverdue && ' (Overdue)'}
                        </span>
                      ) : (
                        'No Target'
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge type="taskStatus" value={t.status} />
                    </td>
                    <td className="p-4 text-right">
                      <select
                        disabled={updatingTaskId === t.id}
                        value={t.status}
                        onChange={(e) => handleStatusUpdate(t.id, e.target.value)}
                        className="text-xs py-1.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">In Review</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Active Initiative Involvement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {metrics?.myProjects?.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3 card-hover-effect">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                </div>
                <StatusBadge type="projectStatus" value={p.status} />
              </div>

              <div className="flex justify-between text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200/60">
                <span>Manager: <strong className="text-slate-800">{p.projectManager?.name || 'Unassigned'}</strong></span>
                <span>Target: <strong className="text-slate-800">{p.endDate || 'TBD'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
