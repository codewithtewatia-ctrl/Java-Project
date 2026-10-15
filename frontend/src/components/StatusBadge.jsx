import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  AlertTriangle, 
  Flame, 
  CircleDot, 
  HelpCircle,
  Shield,
  Briefcase,
  Code2
} from 'lucide-react';

export const StatusBadge = ({ type, value }) => {
  if (!value) return null;

  let baseClass = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border";
  let content = null;

  if (type === 'projectStatus') {
    switch (value) {
      case 'ACTIVE':
        content = (
          <span className={`${baseClass} bg-emerald-500/10 text-emerald-700 border-emerald-500/20`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Sprint
          </span>
        );
        break;
      case 'PLANNING':
        content = (
          <span className={`${baseClass} bg-sky-500/10 text-sky-700 border-sky-500/20`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Planning
          </span>
        );
        break;
      case 'ON_HOLD':
        content = (
          <span className={`${baseClass} bg-amber-500/10 text-amber-700 border-amber-500/20`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            On Hold
          </span>
        );
        break;
      case 'COMPLETED':
        content = (
          <span className={`${baseClass} bg-indigo-500/10 text-indigo-700 border-indigo-500/20`}>
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            Shipped
          </span>
        );
        break;
      case 'CANCELLED':
        content = (
          <span className={`${baseClass} bg-rose-500/10 text-rose-700 border-rose-500/20`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
        break;
      default:
        content = <span className={`${baseClass} bg-slate-100 text-slate-700 border-slate-200`}>{value}</span>;
    }
  } else if (type === 'taskStatus') {
    switch (value) {
      case 'TODO':
        content = (
          <span className={`${baseClass} bg-slate-100 text-slate-600 border-slate-200/80`}>
            <CircleDot className="w-3 h-3 text-slate-400" />
            To Do
          </span>
        );
        break;
      case 'IN_PROGRESS':
        content = (
          <span className={`${baseClass} bg-amber-500/10 text-amber-700 border-amber-500/25`}>
            <Clock className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            In Progress
          </span>
        );
        break;
      case 'REVIEW':
        content = (
          <span className={`${baseClass} bg-purple-500/10 text-purple-700 border-purple-500/25`}>
            <HelpCircle className="w-3 h-3 text-purple-600" />
            In Review
          </span>
        );
        break;
      case 'COMPLETED':
        content = (
          <span className={`${baseClass} bg-emerald-500/10 text-emerald-700 border-emerald-500/25`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Done
          </span>
        );
        break;
      default:
        content = <span className={`${baseClass} bg-slate-100 text-slate-700 border-slate-200`}>{value}</span>;
    }
  } else if (type === 'priority') {
    switch (value) {
      case 'LOW':
        content = (
          <span className={`${baseClass} bg-slate-50 text-slate-500 border-slate-200`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </span>
        );
        break;
      case 'MEDIUM':
        content = (
          <span className={`${baseClass} bg-blue-500/10 text-blue-700 border-blue-500/20`}>
            <AlertCircle className="w-3 h-3 text-blue-600" />
            Medium
          </span>
        );
        break;
      case 'HIGH':
        content = (
          <span className={`${baseClass} bg-orange-500/10 text-orange-700 border-orange-500/20`}>
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            High
          </span>
        );
        break;
      case 'URGENT':
        content = (
          <span className={`${baseClass} bg-rose-500/10 text-rose-700 border-rose-500/30 animate-pulse`}>
            <Flame className="w-3 h-3 text-rose-600" />
            Urgent
          </span>
        );
        break;
      default:
        content = <span className={`${baseClass} bg-slate-100 text-slate-700 border-slate-200`}>{value}</span>;
    }
  } else if (type === 'role') {
    switch (value) {
      case 'ADMIN':
        content = (
          <span className={`${baseClass} bg-rose-500/10 text-rose-700 border-rose-500/20 font-bold`}>
            <Shield className="w-3 h-3 text-rose-600" />
            Admin
          </span>
        );
        break;
      case 'PROJECT_MANAGER':
        content = (
          <span className={`${baseClass} bg-indigo-500/10 text-indigo-700 border-indigo-500/20 font-bold`}>
            <Briefcase className="w-3 h-3 text-indigo-600" />
            Project Manager
          </span>
        );
        break;
      case 'TEAM_MEMBER':
        content = (
          <span className={`${baseClass} bg-teal-500/10 text-teal-700 border-teal-500/20 font-bold`}>
            <Code2 className="w-3 h-3 text-teal-600" />
            Team Member
          </span>
        );
        break;
      default:
        content = <span className={`${baseClass} bg-slate-100 text-slate-700 border-slate-200`}>{value}</span>;
    }
  }

  return content;
};
