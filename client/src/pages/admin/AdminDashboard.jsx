import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Users, Zap, Edit2, X, Check, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ alerts: 0, maintenanceMode: false });
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = () => {
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("API response not ok");
        return res.json();
      })
      .then(settings => {
        setSettingsForm({ alerts: settings?.alerts || 0, maintenanceMode: settings?.maintenanceMode || false });
        // Use real stats from the backend
        setData({
          activeUsers: settings?.stats?.activeUsers || 0,
          students: settings?.stats?.students || 0,
          faculty: settings?.stats?.faculty || 0,
          aiUsage: settings?.stats?.aiUsage || '0 Tokens',
          aiPercent: settings?.stats?.aiPercent || 0,
          uptime: settings?.stats?.uptime || '99.9%',
          settings: { alerts: settings?.alerts || 0, maintenanceMode: settings?.maintenanceMode || false }
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch admin data:", err);
        // Fallback gracefully instead of infinite loading
        setData({
          activeUsers: 0,
          students: 0,
          faculty: 0,
          aiUsage: '0 Tokens',
          aiPercent: 0,
          uptime: 'Offline',
          settings: { alerts: 0, maintenanceMode: false }
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = () => {
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settingsForm)
    })
    .then(res => res.json())
    .then(updated => {
      setData({ ...data, settings: updated });
      setEditingSettings(false);
      setSuccessMsg("Settings updated globally!");
      setTimeout(() => setSuccessMsg(""), 3000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              System <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">Overview 👋</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Monitor system health, AI usage, and user activity globally across the platform.
            </p>
          </div>
          {successMsg && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Check size={18} /> {successMsg}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <h3 className="font-semibold text-gray-500 text-sm mb-1 uppercase tracking-wider">Active Users</h3>
          <p className="text-xl font-bold text-gray-900">{data.activeUsers.toLocaleString()} Total</p>
          <p className="text-sm text-blue-600 font-medium mt-2">{data.students} Students | {data.faculty} Faculty</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-6 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Zap size={24} />
            </div>
          </div>
          <h3 className="font-semibold text-gray-500 text-sm mb-1 uppercase tracking-wider">AI Token Usage</h3>
          <p className="text-xl font-bold text-gray-900">{data.aiUsage}</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${data.aiPercent}%` }}></div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-6 border-t-4 border-t-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <ShieldAlert size={24} />
            </div>
          </div>
          <h3 className="font-semibold text-gray-500 text-sm mb-1 uppercase tracking-wider">System Alerts</h3>
          <p className="text-xl font-bold text-gray-900">{data.settings.alerts} Critical Issues</p>
          <p className="text-sm text-red-600 font-medium mt-2">{data.settings.alerts === 0 ? "All services operational" : "Check logs immediately"}</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-6 border-t-4 border-t-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="font-semibold text-gray-500 text-sm mb-1 uppercase tracking-wider">Server Uptime</h3>
          <p className="text-xl font-bold text-gray-900">{data.uptime}</p>
          <p className="text-sm text-green-600 font-medium mt-2">Past 30 days</p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Global Settings</h2>
          {!editingSettings ? (
            <button onClick={() => setEditingSettings(true)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <Edit2 size={16} /> Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditingSettings(false)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleSaveSettings} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">Maintenance Mode</label>
            {editingSettings ? (
              <select 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={settingsForm.maintenanceMode ? 'true' : 'false'}
                onChange={(e) => setSettingsForm({...settingsForm, maintenanceMode: e.target.value === 'true'})}
              >
                <option value="false">Disabled - Normal Operations</option>
                <option value="true">Enabled - Lockdown System</option>
              </select>
            ) : (
              <p className={`font-medium ${data.settings.maintenanceMode ? 'text-red-500' : 'text-green-500'}`}>
                {data.settings.maintenanceMode ? 'Enabled (System Locked)' : 'Disabled (Operational)'}
              </p>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">Active Alerts Counter</label>
            {editingSettings ? (
              <input 
                type="number"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={settingsForm.alerts}
                onChange={(e) => setSettingsForm({...settingsForm, alerts: parseInt(e.target.value) || 0})}
              />
            ) : (
              <p className="font-medium text-gray-900">{data.settings.alerts} Issues Detected</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
