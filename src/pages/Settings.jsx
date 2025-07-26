import useDarkMode from "../hooks/useDarkMode";

export default function Settings() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div>
      <h2>Configurações</h2>
      <div style={{ marginTop: 20 }}>
        <label style={{ cursor: "pointer", userSelect: "none", fontWeight: '600' }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: 8, cursor: "pointer" }}
          />
          Ativar Tema Escuro
        </label>
      </div>
    </div>
  );
}
