import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function WorkLogs() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [form, setForm] = useState({
    employeeId: '', taskId: '', date: '', workedHours: '', completedCount: '',
    radarId: '', workStatus: 'IN_PROGRESS', remarks: '',
  });

  const load = () => {
    api.get('/worklogs').then((res) => setLogs(res.data.slice().reverse())).catch(() => setError('Could not load work logs'));
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
      await api.post('/worklogs', {
        employee: { id: Number(form.employeeId) },
        task: { id: Number(form.taskId) },
        date: form.date,
        workedHours: Number(form.workedHours),
        completedCount: form.completedCount ? Number(form.completedCount) : null,
        radarId: form.radarId || null,
        workStatus: form.workStatus,
        remarks: form.remarks,
      });
      setShowForm(false);
      setForm({ employeeId: '', taskId: '', date: '', workedHours: '', completedCount: '', radarId: '', workStatus: 'IN_PROGRESS', remarks: '' });
      load();
    } catch (err) {
      setError('Could not save entry — check all required fields');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
  if (!confirm('Delete this entry?')) return;
  try {
    await api.delete(`/worklogs/${id}`);
    setSelectedLog(null);
    load();
  } catch (err) {
    setError('Could not delete entry');
  }
};

  const statusStyles = {
    YET_TO_START: 'text-slate-400',
    IN_PROGRESS: 'text-amber-400',
    COMPLETED: 'text-emerald-400',
    BLOCKED: 'text-red-400',
    LEAVE: 'text-sky-400',
  };

  const inputClass = "w-full bg-[#161B22] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all";
  const labelClass = "block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Daily Work Log</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          {showForm ? 'Cancel' : '+ Log Entry'}
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
              <label className={labelClass}>Task</label>
              <select className={inputClass} required value={form.taskId} onChange={(e) => setForm({ ...form, taskId: e.target.value })}>
                <option value="">Select</option>
                {tasks.map((t) => <option key={t.id} value={t.id}>{t.taskName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Hours</label>
              <input type="number" step="0.5" className={inputClass} required value={form.workedHours} onChange={(e) => setForm({ ...form, workedHours: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Count</label>
              <input type="number" className={inputClass} value={form.completedCount} onChange={(e) => setForm({ ...form, completedCount: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Radar ID</label>
              <input className={inputClass} value={form.radarId} onChange={(e) => setForm({ ...form, radarId: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={form.workStatus} onChange={(e) => setForm({ ...form, workStatus: e.target.value })}>
                <option value="YET_TO_START">YET_TO_START</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="LEAVE">LEAVE</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Remarks</label>
            <input className={inputClass} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20">
            {submitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {logs.map((log) => (
            <div key={log.id} onClick={() => setSelectedLog(log)} className="bg-[#1C2330] border border-slate-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">            <div>
              <p className="text-sm text-slate-100">{log.employee?.name} <span className="text-slate-500">·</span> {log.task?.taskName}</p>
              <p className="text-xs font-mono text-slate-400">{log.date} · {log.workedHours}h {log.radarId && `· Radar ${log.radarId}`}</p>
            </div>
            <span className={`text-xs font-mono uppercase ${statusStyles[log.workStatus] || 'text-slate-400'}`}>{log.workStatus}</span>
          </div>
        ))}
      </div>

      {selectedLog && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLog(null)}>
    <div className="bg-[#1C2330] border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">{selectedLog.employee?.name}'s Entry</h2>
        <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-100 text-sm">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5 font-mono text-sm">
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Task</p><p className="text-slate-100">{selectedLog.task?.taskName || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Date</p><p className="text-slate-100">{selectedLog.date}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Hours</p><p className="text-slate-100">{selectedLog.workedHours}h</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Count</p><p className="text-slate-100">{selectedLog.completedCount ?? '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Radar ID</p><p className="text-slate-100">{selectedLog.radarId || '—'}</p></div>
        <div><p className="text-xs text-slate-400 uppercase mb-0.5">Status</p><p className={statusStyles[selectedLog.workStatus] || 'text-slate-100'}>{selectedLog.workStatus}</p></div>
      </div>
      <div className="mb-6">
        <p className="text-xs font-mono text-slate-400 uppercase mb-1">Remarks</p>
        <p className="text-sm text-slate-300">{selectedLog.remarks || 'None'}</p>
      </div>
      <button onClick={() => handleDelete(selectedLog.id)} className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/20 transition-all">
        Delete Entry
      </button>
    </div>
  </div>
)}
    </Layout>
  );
}