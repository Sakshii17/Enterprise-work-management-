import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeamDashboard from './pages/TeamDashboard';
import Tasks from './pages/Tasks';
import WorkLogs from './pages/WorkLogs';
import Radars from './pages/Radars';
import Leaves from './pages/Leaves';
import UsersTeams from './pages/UsersTeams';
import ProductivitySummary from './pages/ProductivitySummary';
function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team-dashboard" element={<TeamDashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/worklogs" element={<WorkLogs/>}/>
        <Route path="/radars" element={<Radars/>}/>
        <Route path="/leaves" element={<Leaves/>}/>
        <Route path="/people" element={<UsersTeams />} />
        <Route path="/productivity" element={<ProductivitySummary />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;