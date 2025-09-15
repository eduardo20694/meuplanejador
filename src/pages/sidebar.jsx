import { useRef, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/sidebar.css";

export default function AppWithSidebar({ token }) {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // Carregar avatar do usuário logado
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          "https://apirest-production-b815.up.railway.app/api/avatar",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok && data.avatarUrl) {
          setAvatar(
            `https://apirest-production-b815.up.railway.app${data.avatarUrl}`
          );
        }
      } catch (err) {
        console.error("Erro ao carregar avatar:", err);
      }
    };
    fetchAvatar();
  }, [token]);

  // Upload/alterar avatar
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !token) return;

    const url = URL.createObjectURL(file);
    setAvatar(url);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(
        "https://apirest-production-b815.up.railway.app/api/avatar/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok && data.avatarUrl) {
        setAvatar(
          `https://apirest-production-b815.up.railway.app${data.avatarUrl}`
        );
      } else {
        alert(data.error || "Erro ao enviar avatar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avatar");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar">
        <h1 className="sidebar-title">Bem vindo ao Planejador Pessoal</h1>

        <nav className="sidebar-nav">
          <Link to="/dashboard">Planejador</Link>
          <Link to="/settings">Configurações</Link>
        </nav>

        <div className="avatar-container" onClick={handleAvatarClick}>
          {avatar ? (
            <img src={avatar} alt="Avatar do usuário" className="sidebar-avatar" />
          ) : (
            <div className="sidebar-avatar placeholder">Adicionar Foto</div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
