import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const roleStyles = {
  MANAGER: { bg: 'bg-purple-500/15', text: 'text-purple-300', ring: 'ring-purple-500/30' },
  TEAM_LEAD: { bg: 'bg-sky-500/15', text: 'text-sky-300', ring: 'ring-sky-500/30' },
  POC: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', ring: 'ring-emerald-500/30' },
  EMPLOYEE: { bg: 'bg-slate-500/15', text: 'text-slate-300', ring: 'ring-slate-500/30' },
};

const roleGreeting = {
  MANAGER: "Here's how things look across the org today.",
  TEAM_LEAD: "Here's what your team is working on today.",
  POC: "Here's what's moving across your projects today.",
  EMPLOYEE: "Here's what's on your plate today.",
};

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('ewmp_token');
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
      isActive ? 'bg-[#3D4759] text-slate-100' : 'text-slate-400 hover:text-slate-100 hover:bg-[#252B36]'
    }`;

  const roleName = currentUser?.role?.name;
  const style = roleStyles[roleName] || roleStyles.EMPLOYEE;
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-[#161B22] text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-[#1C2330]/50 backdrop-blur">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">EWMP</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navItemClass}>My Dashboard</NavLink>
            <NavLink to="/team-dashboard" className={navItemClass}>Team</NavLink>
            <NavLink to="/tasks" className={navItemClass}>Tasks</NavLink>
            <NavLink to="/worklogs" className={navItemClass}>Work Log</NavLink>
            <NavLink to="/radars" className={navItemClass}>Radars</NavLink>
            <NavLink to="/leaves" className={navItemClass}>Leaves</NavLink>
            <NavLink to="/people" className={navItemClass}>People</NavLink>
            <NavLink to="/productivity" className={navItemClass}>Productivity</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full ${style.bg} ring-1 ${style.ring}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${style.bg} ${style.text} ring-1 ${style.ring}`}>
                {initials}
              </span>
              <span className="text-sm text-slate-100">{currentUser.name}</span>
              <span className={`text-[10px] font-mono uppercase tracking-wide ${style.text}`}>{roleName}</span>
            </div>
          )}
          <button onClick={handleLogout} className="text-xs font-mono text-slate-400 hover:text-slate-100 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {currentUser && (
        <div className={`px-6 py-3 border-b border-slate-800 ${style.bg}`}>
          <p className="max-w-5xl mx-auto text-sm">
            <span className={`font-semibold ${style.text}`}>Welcome back, {currentUser.name}.</span>
            <span className="text-slate-400"> {roleGreeting[roleName] || roleGreeting.EMPLOYEE}</span>
          </p>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}