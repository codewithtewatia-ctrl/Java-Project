import React from 'react';

export const LoadingSkeleton = ({ count = 4, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/4"></div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded w-full"></div>
      ))}
    </div>
  );
};
