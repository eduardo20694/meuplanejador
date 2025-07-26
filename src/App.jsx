import { Link } from "react-router-dom";

export default function App({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/settings">Configurações</Link>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
