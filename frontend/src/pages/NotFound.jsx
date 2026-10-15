import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800">404 - Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-md">
        The requested URL path does not exist or you do not have permission to view it.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};
