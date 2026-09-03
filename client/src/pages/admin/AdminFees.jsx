import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Wallet, Trash2, Edit2, User, Calendar, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminFees = () => {
  const { token } = useAuth();
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFee, setCurrentFee] = useState({ 
    studentName: '', enrollmentNumber: '', feeType: 'Tuition Fee', amount: '', dueDate: '', status: 'Pending' 
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch('/api/admin/fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFees(data);
    } catch (err) {
      console.error('Error fetching fees:', err);
    }
  };

  const filteredFees = fees.filter(f => 
    f.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.feeType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (dbId) => {
    if (!window.confirm("Are you sure you want to delete this fee record?")) return;
    try {
      await fetch(`/api/admin/fees/${dbId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(fees.filter(f => f._id !== dbId));
    } catch (err) {
      console.error('Error deleting fee record:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentFee.studentName || !currentFee.amount || !currentFee.dueDate) return;

    try {
      const url = isEditMode ? `/api/admin/fees/${currentFee._id}` : '/api/admin/fees';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentFee)
      });
      const data = await res.json();
      
      if (isEditMode) {
        setFees(fees.map(f => f._id === data._id ? data : f));
      } else {
        setFees([data, ...fees]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving fee record:', err);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentFee({ studentName: '', enrollmentNumber: '', feeType: 'Tuition Fee', amount: '', dueDate: '', status: 'Pending' });
    setIsModalOpen(true);
  };

  const openEditModal = (fee) => {
    setIsEditMode(true);
    setCurrentFee({
      ...fee,
      dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFee(prev => ({ ...prev, [name]: value }));
  };

  // Stats
  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + (f.amount || 0), 0);
  const totalPending = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue').reduce((acc, f) => acc + (f.amount || 0), 0);
  const overdueCount = fees.filter(f => f.status === 'Overdue').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fee Management</h1>
            <p className="text-gray-500 mt-1">Track student payments, dues, and financial records</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Collected</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overdue Accounts</p>
            <h3 className="text-2xl font-bold text-gray-900">{overdueCount}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, or fee type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.map((fee) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={fee._id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Top Status Bar indicator */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${
              fee.status === 'Paid' ? 'bg-emerald-500' :
              fee.status === 'Overdue' ? 'bg-red-500' : 'bg-orange-400'
            }`} />

            <div className="flex justify-between items-start mb-4 mt-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                  fee.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {fee.studentName?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{fee.studentName}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{fee.enrollmentNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(fee)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(fee._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
               <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium border ${
                  fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  fee.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {fee.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-medium">{fee.feeType}</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">₹{fee.amount?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Due Date</span>
                </div>
                <p className={`font-semibold ${new Date(fee.dueDate) < new Date() && fee.status !== 'Paid' ? 'text-red-600' : 'text-gray-900'}`}>
                  {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

          </motion.div>
        ))}
        {filteredFees.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No fee records found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add a new record.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditMode ? 'Update Fee Record' : 'Add New Fee Record'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Enter the financial details for this student.</p>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Student Name *</label>
                    <input
                      required
                      type="text"
                      name="studentName"
                      value={currentFee.studentName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Enrollment No. *</label>
                    <input
                      required
                      type="text"
                      name="enrollmentNumber"
                      value={currentFee.enrollmentNumber}
                      onChange={handleChange}
                      placeholder="e.g. STU-2026-001"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Fee Type *</label>
                    <select
                      required
                      name="feeType"
                      value={currentFee.feeType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Hostel Fee">Hostel Fee</option>
                      <option value="Transport Fee">Transport Fee</option>
                      <option value="Examination Fee">Examination Fee</option>
                      <option value="Library Fine">Library Fine</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Amount (₹) *</label>
                    <input
                      required
                      type="number"
                      name="amount"
                      min="0"
                      value={currentFee.amount}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Due Date *</label>
                    <input
                      required
                      type="date"
                      name="dueDate"
                      value={currentFee.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Status *</label>
                    <select
                      required
                      name="status"
                      value={currentFee.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    {isEditMode ? 'Save Changes' : 'Add Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFees;
