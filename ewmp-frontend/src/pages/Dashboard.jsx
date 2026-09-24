import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getCurrentUser } from '../utils/auth';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get('/users')
      .then((res) => {
        const me = res.data.find((u) => u.employeeId === user.employeeId);
        if (!me) throw new Error('User not found');
        return api.get(`/dashboard/employee/${me.id}`);
      })
      .then((res) => setDashboard(res.data))
      .catch(() => setError('Could not load dashboard'));
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
      <h1 className="text-2xl font-semibold mb-1">Welcome, {dashboard.employeeName}</h1>
      <p className="text-[#8B93A5] font-mono text-sm mb-8">{user.role}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Tasks" value={dashboard.pendingTasksCount} />
        <StatCard label="Completed Tasks" value={dashboard.completedTasksCount} />
        <StatCard label="Hours Today" value={dashboard.hoursWorkedToday} />
        <StatCard label="Attendance" value={`${dashboard.monthlyProductivity.attendancePercentage}%`} />
      </div>

      <div className="bg-[#252B36] border border-[#3D4759] rounded-lg p-5 mb-8">
        <h2 className="text-xs font-mono text-[#8B93A5] uppercase tracking-wide mb-4">Monthly Productivity</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm">
          <div>
            <p className="text-[#8B93A5] text-xs">Expected</p>
            <p className="text-lg">{dashboard.monthlyProductivity.expectedHours}h</p>
          </div>
          <div>
            <p className="text-[#8B93A5] text-xs">Actual</p>
            <p className="text-lg">{dashboard.monthlyProductivity.actualHours}h</p>
          </div>
          <div>
            <p className="text-[#8B93A5] text-xs">Difference</p>
            <p className={`text-lg ${dashboard.monthlyProductivity.difference < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {dashboard.monthlyProductivity.difference}h
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-mono text-[#8B93A5] uppercase tracking-wide mb-4">My Tasks</h2>
        <div className="space-y-2">
          {dashboard.todaysTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#252B36] border border-[#3D4759] rounded-lg p-4">
      <p className="text-xs font-mono text-[#8B93A5] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-mono">{value}</p>
    </div>
  );
}

const priorityStyles = {
  P0: 'bg-[#E8A33D] border-[#E8A33D]',
  P1: 'border-[#E8A33D] bg-transparent',
  P2: 'border-[#8B93A5] bg-transparent',
  P3: 'border-[#3D4759] bg-transparent',
};

function TaskRow({ task }) {
  return (
    <div className="bg-[#252B36] border border-[#3D4759] rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full border-2 ${priorityStyles[task.priority]}`}></span>
        <div>
          <p className="text-sm">{task.taskName}</p>
          <p className="text-xs font-mono text-[#8B93A5]">{task.project?.projectName}</p>
        </div>
      </div>
      <span className="text-xs font-mono text-[#8B93A5] uppercase">{task.status}</span>
    </div>
  );
}