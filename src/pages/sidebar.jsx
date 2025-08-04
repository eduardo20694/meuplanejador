import { Link, Outlet } from "react-router-dom";
import "../styles/sidebar.css";

export default function AppWithSidebar() {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/settings">Configurações</Link>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
