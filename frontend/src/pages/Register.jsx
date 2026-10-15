import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, User, Mail, Lock, UserCheck, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, email, password, role });
      if (res.success) {
        showToast('Registration successful! Welcome to ProjectFlow.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white font-black text-xl mb-2 shadow-lg shadow-brand-500/30">
            PF
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            Join ProjectFlow
            <Sparkles className="w-5 h-5 text-sky-400" />
          </h2>
          <p className="text-slate-400 text-xs mt-1">Create your team member or manager profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@projectflow.com"
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/90 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-brand-500 focus:outline-none transition-colors"
              >
                <option value="TEAM_MEMBER">Team Member</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Register Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
