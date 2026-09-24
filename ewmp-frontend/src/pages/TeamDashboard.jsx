import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getCurrentUser } from '../utils/auth';
import Layout from '../components/Layout';

export default function TeamDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get('/dashboard/team/1')
      .then((res) => setDashboard(res.data))
      .catch(() => setError('Could not load team dashboard'));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C2128] flex items-center justify-center">
        <p className="text-red-400 font-mono">{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#1C2128] flex items-center justify-center">
        <p className="text-[#8B93A5] font-mono text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-1">{dashboard.teamName}</h1>
      <p className="text-[#8B93A5] font-mono text-sm mb-8">
        Lead: {dashboard.teamLeadName} &nbsp;·&nbsp; Manager: {dashboard.managerName}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={dashboard.totalTasks} />
        <StatCard label="Pending" value={dashboard.pendingTasks} />
        <StatCard label="Completed" value={dashboard.completedTasks} />
        <StatCard label="Overdue" value={dashboard.overdueTasks} accent={dashboard.overdueTasks > 0} />
      </div>

      <div>
        <h2 className="text-xs font-mono text-[#8B93A5] uppercase tracking-wide mb-4">Team Members</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.memberNames.map((name) => (
            <span key={name} className="bg-[#252B36] border border-[#3D4759] rounded-full px-3 py-1.5 text-sm font-mono">
              {name}
            </span>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-[#252B36] border border-[#3D4759] rounded-lg p-4">
      <p className="text-xs font-mono text-[#8B93A5] uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-mono ${accent ? 'text-[#E8A33D]' : ''}`}>{value}</p>
    </div>
  );
}