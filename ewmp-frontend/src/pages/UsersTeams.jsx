import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function UsersTeams() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [userForm, setUserForm] = useState({ employeeId: '', name: '', email: '', password: '', status: 'ACTIVE', roleId: '' });
  const [teamForm, setTeamForm] = useState({ teamName: '', teamLeadId: '', managerId: '' });

  const loadAll = () => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => setError('Could not load users'));
    api.get('/teams').then((res) => setTeams(res.data)).catch(() => setError('Could not load teams'));
    api.get('/roles').then((res) => setRoles(res.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/users', {
        employeeId: userForm.employeeId,
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        status: userForm.status,
        role: { id: Number(userForm.roleId) },
      });
      setShowUserForm(false);
      setUserForm({ employeeId: '', name: '', email: '', password: '', status: 'ACTIVE', roleId: '' });
      loadAll();
    } catch (err) {
      setError('Could not create user — employeeId/email may already exist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/teams', {
        teamName: teamForm.teamName,
        teamLead: { id: Number(teamForm.teamLeadId) },
        manager: { id: Number(teamForm.managerId) },
      });
      setShowTeamForm(false);
      setTeamForm({ teamName: '', teamLeadId: '', managerId: '' });
      loadAll();
    } catch (err) {
      setError('Could not create team');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#161B22] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all";
  const labelClass = "block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wide";
  const tabClass = (active) => `px-4 py-2 text-sm font-mono rounded-lg transition-colors ${active ? 'bg-[#3D4759] text-slate-100' : 'text-slate-400 hover:text-slate-100'}`;

  return (
    <Layout>
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent mb-6">People & Teams</h1>

      <div className="flex gap-2 mb-6">
        <button className={tabClass(tab === 'users')} onClick={() => setTab('users')}>Users</button>
        <button className={tabClass(tab === 'teams')} onClick={() => setTab('teams')}>Teams</button>
      </div>

      {tab === 'users' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowUserForm(!showUserForm)} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
              {showUserForm ? 'Cancel' : '+ New User'}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleUserSubmit} className="bg-[#1C2330] border border-slate-700 rounded-xl p-5 mb-6 space-y-4 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Employee ID</label><input className={inputClass} required value={userForm.employeeId} onChange={(e) => setUserForm({ ...userForm, employeeId: e.target.value })} /></div>
                <div><label className={labelClass}>Name</label><input className={inputClass} required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Email</label><input type="email" className={inputClass} required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} /></div>
                <div><label className={labelClass}>Password</label><input type="password" className={inputClass} required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} /></div>
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select className={inputClass} required value={userForm.roleId} onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}>
                  <option value="">Select role</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
              <button type="submit" disabled={submitting} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20">
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="bg-[#1C2330] border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-100">{u.name}</p>
                  <p className="text-xs font-mono text-slate-400">{u.employeeId} · {u.email}</p>
                </div>
                <span className="text-xs font-mono uppercase text-sky-400">{u.role?.name || '—'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'teams' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowTeamForm(!showTeamForm)} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20">
              {showTeamForm ? 'Cancel' : '+ New Team'}
            </button>
          </div>

          {showTeamForm && (
            <form onSubmit={handleTeamSubmit} className="bg-[#1C2330] border border-slate-700 rounded-xl p-5 mb-6 space-y-4 shadow-xl">
              <div><label className={labelClass}>Team Name</label><input className={inputClass} required value={teamForm.teamName} onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Team Lead</label>
                  <select className={inputClass} required value={teamForm.teamLeadId} onChange={(e) => setTeamForm({ ...teamForm, teamLeadId: e.target.value })}>
                    <option value="">Select</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Manager</label>
                  <select className={inputClass} required value={teamForm.managerId} onChange={(e) => setTeamForm({ ...teamForm, managerId: e.target.value })}>
                    <option value="">Select</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              {error && <p className="text-sm text-red-400 font-mono">{error}</p>}
              <button type="submit" disabled={submitting} className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg px-4 py-2 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20">
                {submitting ? 'Creating...' : 'Create Team'}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {teams.map((t) => (
              <div key={t.id} className="bg-[#1C2330] border border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-100">{t.teamName}</p>
                <p className="text-xs font-mono text-slate-400">Lead: {t.teamLead?.name || '—'} · Manager: {t.manager?.name || '—'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}