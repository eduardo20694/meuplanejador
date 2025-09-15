import { useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/sidebar.css";

export default function AppWithSidebar() {
  const [avatar, setAvatar] = useState(null); // avatar inicia vazio
  const fileInputRef = useRef(null);

  // Função chamada ao selecionar arquivo
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview instantâneo
      const url = URL.createObjectURL(file);
      setAvatar(url);

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        // URL do backend Railway
        const res = await fetch(
          "https://apirest-production-b815.up.railway.app/api/avatar/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (res.ok) {
          // Atualiza avatar com URL retornada pelo backend
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
    }
  };

  // Função chamada ao clicar na imagem/overlay
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar">
        <h1 className="sidebar-title">Bem vindo ao Planejador Pessoal</h1>

        {/* Navegação abaixo do título */}
        <nav className="sidebar-nav">
          <Link to="/dashboard">Planejador</Link>
          <Link to="/settings">Configurações</Link>
        </nav>

        {/* Avatar clicável */}
        <div className="avatar-container" onClick={handleAvatarClick}>
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar do usuário"
              className="sidebar-avatar"
            />
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
