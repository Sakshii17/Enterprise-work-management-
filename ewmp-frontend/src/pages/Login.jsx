import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { employeeId, password });
      localStorage.setItem('ewmp_token', response.data.token);
      const me = await api.get('/auth/me');
      setCurrentUser(me.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid employee ID or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1C2128]">
      {/* Left panel — branding / visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#252B36] items-center justify-center">
        {/* Radar sweep visual */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          {/* Concentric rings */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border border-amber-400/20"
              style={{ width: `${ring * 22}%`, height: `${ring * 22}%` }}
            />
          ))}
          {/* Sweeping radar line */}
          <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left bg-gradient-to-r from-amber-400 to-transparent" />
          </div>
          {/* Blips */}
          <span className="absolute top-[30%] left-[60%] w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse" />
          <span className="absolute top-[65%] left-[38%] w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="absolute top-[45%] left-[25%] w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Center dot */}
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)] z-10" />
        </div>

        <div className="absolute bottom-16 left-16 right-16">
          <p className="font-mono text-xs tracking-widest text-[#8B93A5] uppercase mb-3">Enterprise Work Management Portal</p>
          <h2 className="text-2xl font-semibold text-[#EDEDED] leading-snug mb-2">
            Every task, every hour,<br />tracked in one place.
          </h2>
          <p className="text-sm text-[#8B93A5] max-w-sm">
            Tasks, timesheets, radar tracking, and productivity — unified for teams, leads, and managers.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
              <span className="font-mono text-xs tracking-widest text-[#8B93A5] uppercase">EWMP</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#EDEDED] mb-1">Welcome back</h1>
            <p className="text-sm text-[#8B93A5]">Sign in to access your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#252B36] border border-[#3D4759] rounded-xl p-6 space-y-4 shadow-2xl">
            <div>
              <label className="block text-xs font-mono text-[#8B93A5] mb-1.5 uppercase tracking-wide">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-[#1C2128] border border-[#3D4759] rounded-lg px-3 py-2.5 text-[#EDEDED] font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                placeholder="EMP001"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8B93A5] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bbg-[#1C2128] border border-[#3D4759] rounded-lg px-3 py-2.5 text-[#EDEDED] font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#161B22] font-semibold rounded-lg py-2.5 text-sm hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs font-mono text-slate-600 mt-6">
            Tasks · Timesheets · Radar · Productivity
          </p>
        </div>
      </div>
    </div>
  );
}