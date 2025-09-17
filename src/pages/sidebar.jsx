import { useRef, useState, useEffect, useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/sidebar.css";

const API_BASE = "https://apirest-production-b815.up.railway.app";

export default function AppWithSidebar({ token: propToken, userId }) {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const token = propToken || localStorage.getItem("token");

  // Toast simples
  const showToast = (text, type = "success", ms = 3000) => {
    setToast({ text, type });
    setTimeout(() => setToast(null), ms);
  };

  // Constrói URL completa
  const buildFullUrl = (maybeRelative) => {
    if (!maybeRelative) return null;
    try {
      return new URL(maybeRelative).href;
    } catch {
      return `${API_BASE}${maybeRelative}`;
    }
  };

  // Fetch avatar
  const fetchAvatar = useCallback(async (uid) => {
    if (!uid && !token) {
      setAvatar(null);
      return;
    }

    const url = uid ? `${API_BASE}/api/avatar/${uid}` : `${API_BASE}/api/avatar`;
    const headers = !uid && token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(url, { headers });
      const contentType = res.headers.get("content-type") || "";

      if (!res.ok || !contentType.includes("application/json")) {
        setAvatar(null);
        return;
      }

      const data = await res.json();
      if (data?.avatarUrl) {
        setAvatar(buildFullUrl(data.avatarUrl));
      } else {
        setAvatar(null);
      }
    } catch {
      setAvatar(null);
    }
  }, [token]);

  useEffect(() => {
    fetchAvatar(userId);
  }, [fetchAvatar, userId]);

  // Upload avatar
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!token) return showToast("Usuário não autenticado", "error");

    // Preview local
    const localPreview = URL.createObjectURL(file);
    setAvatar(localPreview);

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch(`${API_BASE}/api/avatar/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const text = ct.includes("application/json") ? await res.json() : await res.text();
        showToast("Erro no upload: " + (text?.error || text || res.statusText), "error");
        return;
      }

      if (!ct.includes("application/json")) {
        showToast("Resposta inesperada do servidor", "error");
        return;
      }

      const data = await res.json();
      if (data?.avatarUrl) {
        setAvatar(buildFullUrl(data.avatarUrl));
        showToast("Avatar atualizado com sucesso!", "success");
      } else {
        showToast("Backend não retornou avatarUrl", "error");
      }
    } catch {
      showToast("Erro ao enviar avatar", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle imagem quebrada
  const handleImgError = () => {
    setAvatar(null);
    showToast("Não foi possível carregar a imagem do avatar", "error");
  };

  // Limpa URL temporária
  useEffect(() => {
    return () => {
      if (avatar && avatar.startsWith("blob:")) URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  return (
    <div className="flex">
      <aside className="sidebar">
        <h1 className="sidebar-title">Schedio</h1>

        <nav className="sidebar-nav" aria-label="Navegação">
          <Link to="/dashboard">Planejador</Link>
          <Link to="/settings">Configurações</Link>
        </nav>

        <div
          className="avatar-container"
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          aria-label={avatar ? "Alterar foto do usuário" : "Adicionar foto do usuário"}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar do usuário"
              className="sidebar-avatar"
              onError={handleImgError}
            />
          ) : (
            <div className="sidebar-avatar placeholder">Adicionar Foto</div>
          )}

          {avatar && <div className="avatar-overlay" aria-hidden>Alterar foto</div>}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
            data-testid="avatar-input"
          />
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>

      {toast && (
        <div className={`custom-toast ${toast.type === "error" ? "error" : "success"}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}

      
    </div>
  );
}
