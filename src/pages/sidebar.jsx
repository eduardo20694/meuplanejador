// Sidebar.jsx
import React from "react";

export default function Sidebar({ onLogout }) {
  return (
    <aside
      style={{
        width: 240,
        backgroundColor: "#1f2937",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>Meu App</h2>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem", cursor: "pointer" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              Dashboard
            </a>
          </li>
          <li style={{ marginBottom: "1rem", cursor: "pointer" }}>
            <a href="/tarefas" style={{ color: "white", textDecoration: "none" }}>
              Tarefas
            </a>
          </li>
          <li style={{ marginBottom: "1rem", cursor: "pointer" }}>
            <a href="/compromissos" style={{ color: "white", textDecoration: "none" }}>
              Compromissos
            </a>
          </li>
          {/* Coloque outras rotas que desejar */}
        </ul>
      </nav>

      <button
        onClick={onLogout}
        style={{
          backgroundColor: "#ef4444",
          border: "none",
          color: "white",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Sair
      </button>
    </aside>
  );
}
