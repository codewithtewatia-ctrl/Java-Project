import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Users, Mail, CheckCircle2, Clock, Briefcase, Zap, Shield, Sparkles } from 'lucide-react';

export const Team = () => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, taskRes] = await Promise.all([
          userService.getAllUsers(),
          taskService.getAllTasks(),
        ]);
        if (userRes.success) setMembers(userRes.data);
        if (taskRes.success) setTasks(taskRes.data);
      } catch (err) {
        showToast('Error loading team directory', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDepartment = (role, name) => {
    if (role === 'ADMIN') return 'Executive & Security';
    if (role === 'PROJECT_MANAGER') return 'Product Operations';
    if (name.toLowerCase().includes('design')) return 'Product Experience & UI';
    if (name.toLowerCase().includes('qa') || name.toLowerCase().includes('test')) return 'Quality Assurance & SRE';
    return 'Full-Stack Engineering';
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6 animate-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Team Directory & Workload</h2>
          <p className="text-xs text-slate-500 mt-0.5">Engineering squad velocity, task throughput, and sprint workload capacity.</p>
        </div>
        <span className="text-xs font-extrabold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200/80 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          {members.length} Active Engineers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => {
          const userTasks = tasks.filter((t) => t.assignee?.id === m.id);
          const completedCount = userTasks.filter((t) => t.status === 'COMPLETED').length;
          const pendingCount = userTasks.length - completedCount;
          const completionRate = userTasks.length > 0 ? (completedCount * 100) / userTasks.length : 0;
          const dept = getDepartment(m.role, m.name);

          return (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col justify-between space-y-4 card-hover-effect">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white font-black text-sm flex items-center justify-center shadow-md relative">
                      {m.name.charAt(0)}
                      <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{m.name}</h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {m.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                    {dept}
                  </span>
                  <StatusBadge type="role" value={m.role} />
                </div>
              </div>

              {/* Progress & Task Metrics */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Sprint Throughput</span>
                    <span className="text-emerald-600 font-extrabold">{completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase">Assigned</p>
                    <p className="text-base font-black text-slate-800 mt-0.5">{userTasks.length}</p>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-extrabold uppercase">Shipped</p>
                    <p className="text-base font-black text-emerald-800 mt-0.5">{completedCount}</p>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                    <p className="text-[10px] text-amber-700 font-extrabold uppercase">In-Flight</p>
                    <p className="text-base font-black text-amber-800 mt-0.5">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
