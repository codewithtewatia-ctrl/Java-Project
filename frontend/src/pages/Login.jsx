import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  ChevronRight
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@projectflow.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [activePersona, setActivePersona] = useState('admin');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const personas = [
    { id: 'admin', label: 'Admin', role: 'System Admin', email: 'admin@projectflow.com', pass: 'admin123', color: 'bg-rose-500' },
    { id: 'manager', label: 'Project Mgr', role: 'Lead PM', email: 'manager@projectflow.com', pass: 'manager123', color: 'bg-indigo-600' },
    { id: 'dev', label: 'Developer', role: 'Staff Eng', email: 'developer@projectflow.com', pass: 'dev123', color: 'bg-teal-500' },
    { id: 'designer', label: 'Designer', role: 'Lead UI/UX', email: 'designer@projectflow.com', pass: 'design123', color: 'bg-purple-500' },
    { id: 'qa', label: 'QA Tester', role: 'QA Lead', email: 'tester@projectflow.com', pass: 'test123', color: 'bg-amber-500' },
  ];

  const handleSelectPersona = (p) => {
    setActivePersona(p.id);
    setEmail(p.email);
    setPassword(p.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password, rememberMe });
      if (res.success) {
        showToast(`Welcome back, ${res.data.name}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid credentials. Please verify and try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Column: SaaS Product Showcase */}
      <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-12 xl:p-16 relative z-10 border-r border-slate-800/60 bg-grid-pattern-dark">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 font-black text-xl">
            PF
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
              ProjectFlow
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Enterprise v2.4
              </span>
            </span>
            <p className="text-xs text-slate-400">High-Velocity Engineering & Sprint Orchestration</p>
          </div>
        </div>

        {/* Center Live Preview Mockup Card */}
        <div className="my-10 max-w-xl">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Window control dots */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">sprint-24-overview.live</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
              </span>
            </div>

            {/* Mini Dashboard Metrics Preview */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Sprint Velocity</p>
                <p className="text-xl font-black text-white mt-0.5">84.6%</p>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12% this cycle
                </p>
              </div>
              <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Active Tasks</p>
                <p className="text-xl font-black text-white mt-0.5">16 Items</p>
                <p className="text-[10px] text-indigo-300 mt-1">4 Critical Path</p>
              </div>
              <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Team SLA</p>
                <p className="text-xl font-black text-emerald-400 mt-0.5">99.4%</p>
                <p className="text-[10px] text-slate-400 mt-1">On-time release</p>
              </div>
            </div>

            {/* Task rows preview */}
            <div className="space-y-2">
              <div className="bg-slate-850/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">Stripe Payment Gateway Integration</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SHIPPED
                </span>
              </div>
              <div className="bg-slate-850/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <span className="font-semibold text-slate-200">Biometric FaceID SDK Integration</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IN PROGRESS
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-8 border-l-2 border-indigo-500 pl-4 py-1">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "ProjectFlow transformed our sprint cadences. We unified product roadmaps, team assignments, and delivery deadlines into one intuitive interface."
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                MV
              </div>
              <div>
                <p className="text-xs font-bold text-white">Marcus Vance</p>
                <p className="text-[11px] text-slate-400">VP of Engineering, Vertex Systems</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC-2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>256-Bit TLS Encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>99.99% Guaranteed SLA</span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Portal */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center p-6 sm:p-10 md:p-12 xl:p-16 relative z-10">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-lg">
              PF
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">ProjectFlow</span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Sign In to ProjectFlow
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1.5">
              Select an account persona below for instant one-click login or enter your credentials.
            </p>
          </div>

          {/* Quick-Switch Persona Tabs */}
          <div className="p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quick Demo Personas</span>
              <span className="text-indigo-400 text-[10px] font-semibold">1-Click Auto-Fill</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {personas.map((p) => {
                const isSelected = activePersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${p.color} text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0`}>
                      {p.label.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="truncate leading-tight">{p.label}</p>
                      <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {p.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate & Launch Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New to ProjectFlow?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1">
                Create Team Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset Account Access</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In this enterprise deployment, please contact your workspace administrator (<code className="text-indigo-300">admin@projectflow.com</code>) to issue an instant credential reset.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
