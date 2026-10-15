import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/extraServices';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Settings as SettingsIcon, Sliders, CheckCircle2, Shield } from 'lucide-react';

export const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      if (res.success && res.data) {
        const map = {};
        res.data.forEach((s) => {
          map[s.settingKey] = s.settingValue;
        });
        setSettings(map);
      }
    } catch (err) {
      showToast('Error loading system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      showToast('Settings updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} type="card" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">System Configuration Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage application defaults, status rules, and platform controls.</p>
        </div>
        <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
          <SettingsIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" /> General Application Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Branding Name</label>
              <input
                type="text"
                value={settings.APP_NAME || 'ProjectFlow'}
                onChange={(e) => handleChange('APP_NAME', e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" /> Operational Defaults
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Project Status</label>
                <select
                  value={settings.DEFAULT_PROJECT_STATUS || 'PLANNING'}
                  onChange={(e) => handleChange('DEFAULT_PROJECT_STATUS', e.target.value)}
                  className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="PLANNING">PLANNING</option>
                  <option value="ACTIVE">ACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Task Status</label>
                <select
                  value={settings.DEFAULT_TASK_STATUS || 'TODO'}
                  onChange={(e) => handleChange('DEFAULT_TASK_STATUS', e.target.value)}
                  className="w-full text-sm p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.EMAIL_NOTIFICATIONS_ENABLED === 'true'}
                  onChange={(e) => handleChange('EMAIL_NOTIFICATIONS_ENABLED', e.target.checked ? 'true' : 'false')}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                  <p className="text-[11px] text-slate-400">Send automatic status emails</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ALLOW_USER_REGISTRATION === 'true'}
                  onChange={(e) => handleChange('ALLOW_USER_REGISTRATION', e.target.checked ? 'true' : 'false')}
                  className="rounded text-brand-600 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">User Registration</p>
                  <p className="text-[11px] text-slate-400">Allow self-registration</p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
