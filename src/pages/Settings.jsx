import { useContext } from "react";
import { DarkModeContext } from "../DarkModeContext";


export default function Settings() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <div>
      <h2>Configurações</h2>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: darkMode ? "#444" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Desativar Modo Noturno" : "Ativar Modo Noturno"}
      </button>
    </div>
  );
}
