import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Radars() {
  const [radars, setRadars] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRadar, setSelectedRadar] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ radarId: '', taskId: '', raisedById: '', assignedById: '', employeeId: '', status: 'OPEN' });

  const load = () => {
    api.get('/radars').then((res) => setRadars(res.data.slice().reverse())).catch(() => setError('Could not load radars'));
  };

  useEffect(() => {
    load();
    api.get('/users').then((res) => setUsers(res.data));
    api.get('/tasks').then((res) => setTasks(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/radars', {
        radarId: form.radarId,
        task: { id: Number(form.taskId) },
        raisedBy: { id: Number(form.raisedById) },
        assignedBy: { id: Number(form.assignedById) },
        employee: { id: Number(form.employeeId) },
        status: form.status,
      });
      setShowForm(false);
      setForm({ radarId: '', taskId: '', raisedById: '', assignedById: '', employeeId: '', status: 'OPEN' });
      load();
    } catch (err) {
      setError('Could not create radar — radar ID may already exist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
  if (!confirm('Delete this entry?')) return;
  try {
    await api.delete(`/radars/${id}`);
    setSelectedLog(null);
    load();
  } catch (err) {
    setError('Could not delete entry');
  }
};

  const inputClass = "w-full bg-[#161B22] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all";
  const labelClass = "block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Radars</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
          {showForm ? 'Cancel' : '+ Raise Radar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1C2330] border border-slate-700 rounded-xl p-5 mb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Radar ID</label>
              <input className={inputClass} required value={form.radarId} onChange={(e) => setForm({ ...form, radarId: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Task</label>
              <select className={inputClass} required value={form.taskId} onChange={(e) => setForm({ ...form, taskId: e.target.value })}>
                <option value="">Select</option>
                {tasks.map((t) => <option key={t.id} value={t.id}>{t.taskName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Raised By</label>
              <select className={inputClass} required value={form.raisedById} onChange={(e) => setForm({ ...form, raisedById: e.target.value })}>
                <option value="">Select</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assigned By</label>
              <select className={inputClass} required value={form.assignedById} onChange={(e) => setForm({ ...form, assignedById: e.target.value })}>
                <option value="">Select</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Handled By</label>
              <select className={inputClass} required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                <option value="">Select</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20">
            {submitting ? 'Saving...' : 'Raise Radar'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {radars.map((r) => (
            <div key={r.id} onClick={() => setSelectedRadar(r)} className="bg-[#1C2330] border border-slate-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">            <div>
              <p className="text-sm text-slate-100">Radar {r.radarId} <span className="text-slate-500">·</span> {r.task?.taskName}</p>
              <p className="text-xs font-mono text-slate-400">Raised by {r.raisedBy?.name} · Handled by {r.employee?.name}</p>
            </div>
            <span className={`text-xs font-mono uppercase ${r.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'}`}>{r.status}</span>
          </div>
        ))}
      </div>

      {selectedRadar && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRadar(null)}>
    <div className="bg-[#1C2330] border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Radar {selectedRadar.radarId}</h2>
        <button onClick={() => setSelectedRadar(null)} className="text-slate-400 hover:text-slate-100 text-sm">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5 font-mono text-sm">
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Task</p><p className="text-slate-100">{selectedRadar.task?.taskName || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Status</p><p className={selectedRadar.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'}>{selectedRadar.status}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Raised By</p><p className="text-slate-100">{selectedRadar.raisedBy?.name || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Assigned By</p><p className="text-slate-100">{selectedRadar.assignedBy?.name || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Handled By</p><p className="text-slate-100">{selectedRadar.employee?.name || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Closed Date</p><p className="text-slate-100">{selectedRadar.closedDate || '—'}</p></div>
      </div>
      <button onClick={() => handleDelete(selectedRadar.id)} className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/20 transition-all">
        Delete Radar
      </button>
    </div>
  </div>
)}

    </Layout>
  );
}