import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({
    taskName: '', description: '', priority: 'P2', status: 'NEW',
    projectId: '', createdById: '', assignedUserIds: [], startDate: '', dueDate: '',
  });
  const [error, setError] = useState('');

  const loadTasks = () => {
    api.get('/tasks').then((res) => setTasks(res.data)).catch(() => setError('Could not load tasks'));
  };

  useEffect(() => {
    loadTasks();
    api.get('/users').then((res) => setUsers(res.data));
    api.get('/projects').then((res) => setProjects(res.data));
  }, []);

  const handleAssignedChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm({ ...form, assignedUserIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.post('/tasks', {
        taskName: form.taskName,
        description: form.description,
        priority: form.priority,
        status: form.status,
        project: { id: Number(form.projectId) },
        createdBy: { id: Number(form.createdById) },
        assignedUsers: form.assignedUserIds.map((id) => ({ id: Number(id) })),
        startDate: form.startDate || null,
        dueDate: form.dueDate || null,
      });
      setShowForm(false);
      setForm({ taskName: '', description: '', priority: 'P2', status: 'NEW', projectId: '', createdById: '', assignedUserIds: [], startDate: '', dueDate: '' });
      loadTasks();
    } catch (err) {
      setError('Could not create task — check you have permission and all fields are valid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      setError('Could not delete task');
    }
  };

  const priorityStyles = {
    P0: 'bg-amber-400 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    P1: 'border-amber-400 bg-transparent',
    P2: 'border-sky-400 bg-transparent',
    P3: 'border-slate-500 bg-transparent',
  };

  const statusStyles = {
    NEW: 'text-slate-400',
    ASSIGNED: 'text-sky-400',
    IN_PROGRESS: 'text-amber-400',
    COMPLETED: 'text-emerald-400',
    CLOSED: 'text-emerald-500',
  };

  const inputClass = "w-full bg-[#161B22] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all";
  const labelClass = "block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1C2330] border border-slate-700 rounded-xl p-5 mb-6 space-y-4 shadow-xl">
          <div>
            <label className={labelClass}>Task Name</label>
            <input className={inputClass} required value={form.taskName} onChange={(e) => setForm({ ...form, taskName: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Priority</label>
              <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Project</label>
              <select className={inputClass} required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Created By</label>
              <select className={inputClass} required value={form.createdById} onChange={(e) => setForm({ ...form, createdById: e.target.value })}>
                <option value="">Select creator</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role?.name})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Assign To (hold Ctrl/Cmd to select multiple)</label>
            <select multiple className={`${inputClass} h-28`} value={form.assignedUserIds} onChange={handleAssignedChange}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role?.name})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" className={inputClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" className={inputClass} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="group bg-[#1C2330] border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${priorityStyles[task.priority]}`}></span>
              <div>
                <p className="text-sm text-slate-100">{task.taskName}</p>
                <p className="text-xs font-mono text-slate-400">
                  {task.project?.projectName} · {task.assignedUsers?.map((u) => u.name).join(', ') || 'Unassigned'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono uppercase ${statusStyles[task.status] || 'text-slate-400'}`}>{task.status}</span>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-[#1C2330] border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${priorityStyles[selectedTask.priority]}`}></span>
                <h2 className="text-lg font-semibold text-slate-100">{selectedTask.taskName}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-5">{selectedTask.description || 'No description provided.'}</p>

            <div className="grid grid-cols-2 gap-4 mb-5 font-mono text-sm">
              <DetailField label="Status" value={selectedTask.status} accent={statusStyles[selectedTask.status]} />
              <DetailField label="Priority" value={selectedTask.priority} />
              <DetailField label="Project" value={selectedTask.project?.projectName || '—'} />
              <DetailField label="Team" value={selectedTask.project?.team?.teamName || '—'} />
              <DetailField label="Start Date" value={selectedTask.startDate || '—'} />
              <DetailField label="Due Date" value={selectedTask.dueDate || '—'} />
            </div>

            <div className="mb-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-2">Created By</p>
              <p className="text-sm text-slate-100">
                {selectedTask.createdBy?.name || 'Unknown'}
                {selectedTask.createdBy?.role?.name && (
                  <span className="text-slate-400 font-mono text-xs"> · {selectedTask.createdBy.role.name}</span>
                )}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-2">Assigned To</p>
              <div className="flex flex-wrap gap-2">
                {selectedTask.assignedUsers?.length > 0 ? (
                  selectedTask.assignedUsers.map((u) => (
                    <span key={u.id} className="bg-[#161B22] border border-slate-700 rounded-full px-3 py-1 text-xs font-mono text-slate-200">
                      {u.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">Unassigned</span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDelete(selectedTask.id)}
              className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              Delete Task
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function DetailField({ label, value, accent }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={accent || 'text-slate-100'}>{value}</p>
    </div>
  );
}