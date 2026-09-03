import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, ShieldCheck, Activity, PlusCircle, RefreshCw, Trash2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAuditLogs = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  // Metrics Calculation
  const totalEvents = logs.length;
  const creates = logs.filter(l => l.action === 'CREATE').length;
  const updates = logs.filter(l => l.action === 'UPDATE').length;
  const deletes = logs.filter(l => l.action === 'DELETE').length;

  // Filtering Logic
  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.adminId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'All' || l.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionStyle = (action) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-50 text-red-700 border-red-200';
      case 'LOGIN': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="w-3.5 h-3.5" />;
      case 'UPDATE': return <RefreshCw className="w-3.5 h-3.5" />;
      case 'DELETE': return <Trash2 className="w-3.5 h-3.5" />;
      case 'LOGIN': return <Shield className="w-3.5 h-3.5" />;
      default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    
    // Create CSV content
    const headers = ['Timestamp', 'Admin ID', 'Action', 'Entity', 'IP Address', 'Details'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(l => {
      const row = [
        `"${new Date(l.createdAt).toLocaleString()}"`,
        `"${l.adminId}"`,
        `"${l.action}"`,
        `"${l.entity}"`,
        `"${l.ipAddress || 'N/A'}"`,
        `"${l.details}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Audit Logs</h1>
            <p className="text-gray-500 mt-1">System security events and admin activity tracking</p>
          </div>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={filteredLogs.length === 0}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalEvents}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <PlusCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Creates</p>
            <h3 className="text-2xl font-bold text-gray-900">{creates}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Updates</p>
            <h3 className="text-2xl font-bold text-gray-900">{updates}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Deletes</p>
            <h3 className="text-2xl font-bold text-gray-900">{deletes}</h3>
          </div>
        </motion.div>
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Admin ID or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="flex-1 md:w-48 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700"
            >
              <option value="All">All Actions</option>
              <option value="CREATE">Creates</option>
              <option value="UPDATE">Updates</option>
              <option value="DELETE">Deletes</option>
              <option value="LOGIN">Logins</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Timestamp</th>
                <th className="px-6 py-4 whitespace-nowrap">Admin ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Action</th>
                <th className="px-6 py-4 whitespace-nowrap">Entity</th>
                <th className="px-6 py-4 w-full">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block text-xs font-bold border border-gray-200">
                        {log.adminId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getActionStyle(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-xs inline-block">
                        {log.entity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 line-clamp-1">{log.details}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium text-base">No audit logs found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          <span>Showing {filteredLogs.length} of {logs.length} total events</span>
          <span>Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
