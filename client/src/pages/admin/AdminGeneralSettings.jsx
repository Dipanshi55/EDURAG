import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, AlertTriangle, Building, Mail, MapPin, ShieldAlert, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminGeneralSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    alerts: 0,
    organizationName: 'CampusMind AI',
    supportEmail: 'support@campusmind.ai',
    address: '123 Campus Drive, Tech City'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings({
        maintenanceMode: data.maintenanceMode || false,
        alerts: data.alerts || 0,
        organizationName: data.organizationName || '',
        supportEmail: data.supportEmail || '',
        address: data.address || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <Settings className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">General Settings</h1>
            <p className="text-gray-500 mt-1">Configure global application preferences</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {successMsg && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
              <Check size={16} /> {successMsg}
            </motion.div>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* System Controls Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">System Controls</h2>
              <p className="text-sm text-gray-500">Critical platform toggles</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500 mt-1">When enabled, the platform is locked down for all students and faculty. Only Super Admins can access the system.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Active System Alerts
              </label>
              <input 
                type="number" 
                name="alerts"
                value={settings.alerts}
                onChange={handleChange}
                className="w-full md:w-64 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Set the number of critical alerts to display on the dashboard (0 = All clear).</p>
            </div>
          </div>
        </div>

        {/* Organization Profile Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Organization Profile</h2>
              <p className="text-sm text-gray-500">Campus details for communications</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                Organization Name
              </label>
              <input 
                type="text" 
                name="organizationName"
                value={settings.organizationName}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. TGPCET Campus"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-gray-400" /> Support Contact Email
              </label>
              <input 
                type="email" 
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Campus Address
              </label>
              <input 
                type="text" 
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGeneralSettings;
