import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function ProductivitySummary() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const load = () => {
    api.get(`/dashboard/productivity-summary?year=${year}&month=${month}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load summary — you may not have permission to view this'));
  };

  useEffect(() => { load(); }, [year, month]);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const attendanceColor = (pct) => {
    if (pct >= 90) return 'text-emerald-400';
    if (pct >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const selectClass = "bg-[#161B22] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400";

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Monthly Productivity Summary
        </h1>
        <div className="flex gap-2">
          <select className={selectClass} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select className={selectClass} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 font-mono mb-4">{error}</p>}

      <div className="bg-[#1C2330] border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Employee</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Working Days</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Leave Days</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Expected</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Actual</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Difference</th>
              <th className="px-4 py-3 text-xs font-mono text-slate-400 uppercase tracking-wide">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.employeeId} className="border-b border-slate-800 last:border-0 hover:bg-[#252B36] transition-colors">
                <td className="px-4 py-3 text-slate-100">{r.employeeName}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{r.workingDays}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{r.leaveDays}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{r.expectedHours}h</td>
                <td className="px-4 py-3 font-mono text-slate-300">{r.actualHours}h</td>
                <td className={`px-4 py-3 font-mono ${r.difference < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {r.difference}h
                </td>
                <td className={`px-4 py-3 font-mono font-semibold ${attendanceColor(r.attendancePercentage)}`}>
                  {r.attendancePercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}