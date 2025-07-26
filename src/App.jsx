import { useState } from "react";
import "./styles/global.css";

export default function App() {
  const [tasks, setTasks] = useState([]); // Começa sem tarefas
  const [appointments, setAppointments] = useState([]); // Começa sem compromissos
  const [files, setFiles] = useState([]); // Começa sem arquivos


  // Inputs controlados
  const [newTask, setNewTask] = useState("");
  const [newAppointment, setNewAppointment] = useState("");

  // Adicionar tarefa
  function addTask() {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  }

  // Adicionar compromisso
  function addAppointment() {
    if (!newAppointment.trim()) return;
    setAppointments((prev) => [
      ...prev,
      { id: Date.now(), text: newAppointment.trim() },
    ]);
    setNewAppointment("");
  }

  // Excluir tarefa
  function removeTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  // Excluir compromisso
  function removeAppointment(id) {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  }

  // Marcar tarefa como feita/não feita
  function toggleTaskDone(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  // Upload PDFs
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" &&
        !files.some((f) => f.name === file.name)
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <a href="#">Dashboard</a>
          <a href="#">Configurações</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="main-title">Painel Principal</h2>

        <div className="grid">
          {/* Tarefas Diárias */}
          <section className="card">
            <h3>Tarefas Diárias</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nova tarefa"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border p-2 rounded flex-grow"
              />
              <button onClick={addTask} className="label-button">
                Adicionar
              </button>
            </div>
            <ul className="list">
              {tasks.length === 0 && (
                <li className="empty">Nenhuma tarefa adicionada</li>
              )}
              {tasks.map(({ id, text, done }) => (
                <li key={id} className="flex items-center justify-between">
                  <label
                    style={{
                      textDecoration: done ? "line-through" : "none",
                      cursor: "pointer",
                      flexGrow: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleTaskDone(id)}
                      style={{ marginRight: 8 }}
                    />
                    {text}
                  </label>
                  <button
                    onClick={() => removeTask(id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Excluir tarefa"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Compromissos Diários */}
          <section className="card">
            <h3>Compromissos Diários</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Novo compromisso"
                value={newAppointment}
                onChange={(e) => setNewAppointment(e.target.value)}
                className="border p-2 rounded flex-grow"
              />
              <button onClick={addAppointment} className="label-button bg-green-600 hover:bg-green-700">
                Adicionar
              </button>
            </div>
            <ul className="list">
              {appointments.length === 0 && (
                <li className="empty">Nenhum compromisso adicionado</li>
              )}
              {appointments.map(({ id, text }) => (
                <li
                  key={id}
                  className="flex items-center justify-between"
                  style={{ gap: "0.5rem" }}
                >
                  <span>{text}</span>
                  <button
                    onClick={() => removeAppointment(id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Excluir compromisso"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Upload de PDFs */}
          <section
            className="card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h3>Anexar Documentos (PDF)</h3>

            <label className="label-button" style={{ maxWidth: "fit-content" }}>
              Selecionar PDFs
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="hidden-input"
                onChange={handleFileChange}
              />
            </label>

            <ul className="file-list">
              {files.length === 0 && <li className="empty">Nenhum arquivo anexado</li>}
              {files.map((file) => {
                // cria URL temporária para abrir o PDF
                const url = URL.createObjectURL(file);
                return (
                  <li key={file.name}>
                    📄{" "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline" }}
                      onClick={() => {
                        // limpa o URL depois de abrir para evitar memory leak
                        setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
                      }}
                    >
                      {file.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

