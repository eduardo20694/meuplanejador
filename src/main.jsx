import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppWithSidebar from "./App.jsx"; // layout com sidebar
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Rotas públicas sem sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas privadas com sidebar */}
      <Route
        element={
          <PrivateRoute>
            <AppWithSidebar />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        {/* Pode adicionar outras rotas privadas aqui */}
      </Route>

      {/* Redireciona raiz para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
