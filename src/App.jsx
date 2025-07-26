import { Routes, Route, Link } from "react-router-dom";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/settings">Configurações</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
