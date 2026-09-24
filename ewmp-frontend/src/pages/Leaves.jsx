import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [form, setForm] = useState({ employeeId: '', leaveDate: '', leaveType: 'CASUAL', reason: '', approvedById: '', status: 'PENDING' });

  const load = () => {
    api.get('/leaves').then((res) => setLeaves(res.data.slice().reverse())).catch(() => setError('Could not load leaves'));
  };

  useEffect(() => {
    load();
    api.get('/users').then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/leaves', {
        employee: { id: Number(form.employeeId) },
        leaveDate: form.leaveDate,
        leaveType: form.leaveType,
        reason: form.reason,
        approvedBy: { id: Number(form.approvedById) },
        status: form.status,
      });
      setShowForm(false);
      setForm({ employeeId: '', leaveDate: '', leaveType: 'CASUAL', reason: '', approvedById: '', status: 'PENDING' });
      load();
    } catch (err) {
      setError('Could not submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
  if (!confirm('Delete this entry?')) return;
  try {
    await api.delete(`/leaves/${id}`);
    setSelectedLog(null);
    load();
  } catch (err) {
    setError('Could not delete entry');
  }
};

  const statusColor = { PENDING: 'text-amber-400', APPROVED: 'text-emerald-400', REJECTED: 'text-red-400' };
  const inputClass = "w-full bg-[#1C2128] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all";
  const labelClass = "block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Leave Requests</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
          {showForm ? 'Cancel' : '+ Request Leave'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1C2330] border border-slate-700 rounded-xl p-5 mb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employee</label>
              <select className={inputClass} required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                <option value="">Select</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} required value={form.leaveDate} onChange={(e) => setForm({ ...form, leaveDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select className={inputClass} value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                <option value="CASUAL">CASUAL</option>
                <option value="SICK">SICK</option>
                <option value="PLANNED">PLANNED</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Approved By</label>
              <select className={inputClass} required value={form.approvedById} onChange={(e) => setForm({ ...form, approvedById: e.target.value })}>
                <option value="">Select</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <input className={inputClass} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20">
            {submitting ? 'Saving...' : 'Submit Request'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {leaves.map((l) => (
            <div key={l.id} onClick={() => setSelectedLeaves(log)} className="bg-[#1C2330] border border-slate-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">            <div>
              <p className="text-sm text-slate-100">{l.employee?.name} <span className="text-slate-500">·</span> {l.leaveType}</p>
              <p className="text-xs font-mono text-slate-400">{l.leaveDate} {l.reason && `· ${l.reason}`}</p>
            </div>
            <span className={`text-xs font-mono uppercase ${statusColor[l.status] || 'text-slate-400'}`}>{l.status}</span>
          </div>
        ))}
      </div>

      {selectedLeave && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLeave(null)}>
    <div className="bg-[#1C2330] border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">{selectedLeave.employee?.name}'s Leave</h2>
        <button onClick={() => setSelectedLeave(null)} className="text-slate-400 hover:text-slate-100 text-sm">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5 font-mono text-sm">
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Date</p><p className="text-slate-100">{selectedLeave.leaveDate}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Type</p><p className="text-slate-100">{selectedLeave.leaveType}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Status</p><p className={statusColor[selectedLeave.status] || 'text-slate-100'}>{selectedLeave.status}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Approved By</p><p className="text-slate-100">{selectedLeave.approvedBy?.name || '—'}</p></div>
      </div>
      <div className="mb-6">
        <p className="text-xs font-mono text-slate-400 uppercase mb-1">Reason</p>
        <p className="text-sm text-slate-300">{selectedLeave.reason || 'None'}</p>
      </div>
      <button onClick={() => handleDelete(selectedLeave.id)} className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/20 transition-all">
        Delete Leave
      </button>
    </div>
  </div>
)}

    </Layout>
  );
}