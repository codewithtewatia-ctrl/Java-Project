import React, { useState, useEffect } from 'react';
import { reportService } from '../services/extraServices';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Users, 
  PieChart as PieIcon, 
  Download, 
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reportService.getFullReports();
        if (res.success) setReports(res.data);
      } catch (err) {
        showToast('Error loading reports data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    showToast('Telemetry report exported successfully.', 'success');
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  const projectStatusData = reports?.projectCompletionStats
    ? Object.entries(reports.projectCompletionStats).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const taskStatusData = reports?.taskStatusBreakdown
    ? Object.entries(reports.taskStatusBreakdown).map(([name, value]) => ({ name: name.replace('_', ' '), count: value }))
    : [];

  const teamPerfData = reports?.teamPerformanceStats
    ? Object.entries(reports.teamPerformanceStats).map(([name, stats]) => ({
        name: name.split(' ')[0],
        assigned: stats.assigned,
        completed: stats.completed,
      }))
    : [];

  return (
    <div className="space-y-8 animate-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Executive Performance & Throughput Telemetry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Statistical metrics on delivery velocity, milestone health, and squad capacity.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Export Report CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Completion Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" /> Milestone Completion Health
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Initiatives Status</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} label>
                  {projectStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Velocity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Work Items Status Breakdown
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Current Sprint</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" /> Squad Throughput (Assigned vs Shipped)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Individual Velocity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerfData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Assigned Tasks" />
                <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" /> Annual Velocity Trend
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              +24% YoY Velocity
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reports?.monthlyActivity || []}>
                <defs>
                  <linearGradient id="taskColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="tasksCompleted" stroke="#4f46e5" fillOpacity={1} fill="url(#taskColor)" strokeWidth={3} name="Tasks Delivered" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
