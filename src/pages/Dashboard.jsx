import { useState, useEffect } from "react";
import "../styles/global.css";

const API_BASE = "https://apirest-production-b815.up.railway.app/api";

function formatDateBR(date) {
  if (!(date instanceof Date) || isNaN(date)) return "";
  return date.toLocaleDateString("pt-BR");
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [files, setFiles] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [newAppointment, setNewAppointment] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("12:00");

  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem("token");

  function showNotification(type, message) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  function authHeaders(contentType = "application/json") {
    return {
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    if (!token) {
      showNotification("error", "Usuário não autenticado");
      return;
    }

    async function fetchData() {
      const dateStr = selectedDate.toISOString().split("T")[0];
      try {
        const [resTasks, resAppts, resFiles] = await Promise.all([
          fetch(`${API_BASE}/tasks?date=${dateStr}`, { headers: authHeaders() }),
          fetch(`${API_BASE}/appointments?date=${dateStr}`, { headers: authHeaders() }),
          fetch(`${API_BASE}/pdfs`, { headers: authHeaders() }),
        ]);

        if (!resTasks.ok) throw new Error("Erro ao buscar tarefas");
        if (!resAppts.ok) throw new Error("Erro ao buscar compromissos");
        if (!resFiles.ok) throw new Error("Erro ao buscar arquivos PDF");

        const [dataTasks, dataAppts, dataFiles] = await Promise.all([
          resTasks.json(),
          resAppts.json(),
          resFiles.json(),
        ]);

        // Datas já vêm do backend para o dia correto, não precisa converter
        setTasks(dataTasks);
        setAppointments(dataAppts);
        setFiles(dataFiles);
      } catch (err) {
        showNotification("error", err.message);
      }
    }

    fetchData();
  }, [token, selectedDate]);

  function goPrevDay() {
    setSelectedDate(d => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() - 1);
      return newDate;
    });
  }

  function goNextDay() {
    setSelectedDate(d => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() + 1);
      return newDate;
    });
  }

  // --- TAREFAS ---

  async function addTask() {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          titulo: newTask.trim(),
          date: selectedDate.toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao adicionar tarefa");
      }

      const createdTask = await res.json();

      setTasks(prev => [...prev, createdTask]);
      setNewTask("");
      showNotification("success", "Tarefa adicionada com sucesso!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  async function toggleTaskDone(id) {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error("Tarefa não encontrada");

      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ done: !task.done }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar tarefa");
      const updatedTask = await res.json();

      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  async function removeTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao remover tarefa");
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification("success", "Tarefa removida!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  // --- COMPROMISSOS ---

  async function addAppointment() {
    if (!newAppointment.trim() || !newAppointmentTime) return;

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          titulo: newAppointment.trim(),
          hora: newAppointmentTime,
          date: selectedDate.toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao adicionar compromisso");
      }

      const createdAppt = await res.json();
      setAppointments(prev => [...prev, createdAppt]);
      setNewAppointment("");
      setNewAppointmentTime("12:00");
      showNotification("success", "Compromisso adicionado com sucesso!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  async function removeAppointment(id) {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao remover compromisso");
      setAppointments(prev => prev.filter(a => a.id !== id));
      showNotification("success", "Compromisso removido!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  // --- PDFs ---

  async function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        if (file.type === "application/pdf") {
          formData.append("pdfs", file);
        }
      });

      if (formData.getAll("pdfs").length === 0) return;

      const res = await fetch(`${API_BASE}/pdfs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao enviar arquivos");
      }

      const uploadedFiles = await res.json();
      setFiles(prev => [...prev, ...uploadedFiles]);
      showNotification("success", "Arquivo(s) PDF adicionado(s) com sucesso!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  async function removeFile(id) {
    try {
      const res = await fetch(`${API_BASE}/pdfs/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao remover arquivo");
      setFiles(prev => prev.filter(f => f.id !== id));
      showNotification("success", "Arquivo PDF removido!");
    } catch (err) {
      showNotification("error", err.message);
    }
  }

  return (
    <div
      className="flex h-screen bg-gray-100 text-gray-800"
      style={{ flexDirection: "column" }}
    >
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: notification.type === "success" ? "#16a34a" : "#dc2626",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "0 0 0.5rem 0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "600",
            userSelect: "none",
            pointerEvents: "none",
            minWidth: 300,
            textAlign: "center",
          }}
        >
          {notification.message}
        </div>
      )}

      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#f9fafb",
          marginTop: notification ? 48 : 0,
          transition: "margin-top 0.3s ease",
        }}
      >
        <button onClick={goPrevDay} style={{ padding: "0.3rem 0.8rem" }}>
          {"<"}
        </button>
        <strong style={{ fontSize: 18 }}>{formatDateBR(selectedDate)}</strong>
        <button onClick={goNextDay} style={{ padding: "0.3rem 0.8rem" }}>
          {">"}
        </button>
      </header>

      <main
        className="content"
        style={{ flex: 1, overflowY: "auto", padding: "2rem" }}
      >
        <h2 className="main-title">Painel Principal</h2>

        <div
          className="grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}
        >
          {/* Tarefas */}
          <section className="card">
            <h3>Tarefas para {formatDateBR(selectedDate)}</h3>

            <div className="inputs-group-vertical">
              <input
                type="text"
                placeholder="Nova tarefa"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <button onClick={addTask}>Adicionar</button>
            </div>

            <ul className="list">
              {tasks.length === 0 && <li className="empty">Nenhuma tarefa adicionada</li>}
              {tasks.map(({ id, titulo, done }) => (
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
                    {titulo}
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

          {/* Compromissos */}
          <section className="card">
            <h3>Compromissos para {formatDateBR(selectedDate)}</h3>

            <div className="inputs-group-vertical">
              <input
                type="text"
                placeholder="Novo compromisso"
                value={newAppointment}
                onChange={e => setNewAppointment(e.target.value)}
              />
              <div className="agenda-bottom-row">
                <input
                  type="time"
                  value={newAppointmentTime}
                  onChange={e => setNewAppointmentTime(e.target.value)}
                />
                <button onClick={addAppointment} className="small-button">
                  Adicionar
                </button>
              </div>
            </div>

            <ul className="list">
              {appointments.length === 0 && <li className="empty">Nenhum compromisso adicionado</li>}
              {appointments.map(({ id, titulo, hora }) => (
                <li
                  key={id}
                  className="flex items-center justify-between"
                  style={{ gap: "0.5rem" }}
                >
                  <span style={{ width: 60, fontWeight: "bold" }}>{hora}</span>
                  <span>{titulo}</span>
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
          <section className="card" style={{ display: "flex", flexDirection: "column" }}>
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
              {files.map(({ id, name, url }) => (
                <li
                  key={id}
                  className="flex items-center justify-between"
                  style={{ gap: "0.5rem" }}
                >
                  <span>
                    📄{" "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline" }}
                    >
                      {name}
                    </a>
                  </span>
                  <button
                    onClick={() => removeFile(id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    title="Remover arquivo"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
