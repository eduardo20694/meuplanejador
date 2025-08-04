import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import AppWithSidebar from "./pages/Sidebar.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";

import { DarkModeProvider } from "./DarkModeContext"; // import do contexto

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      {/* Rotas públicas sem sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas privadas com sidebar e contexto de dark mode */}
      <Route
        element={
          <PrivateRoute>
            <DarkModeProvider>
              <AppWithSidebar />
            </DarkModeProvider>
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  </HashRouter>
);
