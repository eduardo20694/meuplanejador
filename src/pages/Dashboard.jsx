import { useState } from "react";
import "../styles/global.css";

function formatDateBR(date) {
  return date.toLocaleDateString("pt-BR");
}

function isSameDay(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [files, setFiles] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [newAppointment, setNewAppointment] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("12:00");

  // Estado para notificação
  const [notification, setNotification] = useState(null);
  // notification: { type: "success" | "error", message: string }

  function showNotification(type, message) {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  function goPrevDay() {
    setSelectedDate((d) => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() - 1);
      return newDate;
    });
  }

  function goNextDay() {
    setSelectedDate((d) => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() + 1);
      return newDate;
    });
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newTask.trim(), done: false, date: new Date(selectedDate) },
    ]);
    setNewTask("");
    showNotification("success", "Tarefa adicionada com sucesso!");
  }

  function addAppointment() {
    if (!newAppointment.trim()) return;
    setAppointments((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newAppointment.trim(),
        date: new Date(selectedDate),
        time: newAppointmentTime,
      },
    ]);
    setNewAppointment("");
    setNewAppointmentTime("12:00");
    showNotification("success", "Compromisso adicionado com sucesso!");
  }

  function toggleTaskDone(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    showNotification("error", "Tarefa removida!");
  }

  function removeAppointment(id) {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    showNotification("error", "Compromisso removido!");
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" &&
        !files.some((f) => f.name === file.name)
    );
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    showNotification("success", "Arquivo(s) PDF adicionado(s) com sucesso!");
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((file) => file.name !== name));
    showNotification("error", "Arquivo PDF removido!");
  }

  const tasksToday = tasks.filter((task) => isSameDay(task.date, selectedDate));
  const appointmentsToday = appointments.filter((appt) =>
    isSameDay(appt.date, selectedDate)
  );

  return (
    <div
      className="flex h-screen bg-gray-100 text-gray-800"
      style={{ flexDirection: "column" }}
    >
      {/* Notificação fixa no topo */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor:
              notification.type === "success" ? "#16a34a" : "#dc2626", // verde ou vermelho
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
          marginTop: notification ? 48 : 0, // dar espaço pra notificação
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
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={addTask}>Adicionar</button>
            </div>

            <ul className="list">
              {tasksToday.length === 0 && (
                <li className="empty">Nenhuma tarefa adicionada</li>
              )}
              {tasksToday.map(({ id, text, done }) => (
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

          {/* Compromissos */}
          <section className="card">
            <h3>Compromissos para {formatDateBR(selectedDate)}</h3>

            <div className="inputs-group-vertical">
              <input
                type="text"
                placeholder="Novo compromisso"
                value={newAppointment}
                onChange={(e) => setNewAppointment(e.target.value)}
              />
              <div className="agenda-bottom-row">
                <input
                  type="time"
                  value={newAppointmentTime}
                  onChange={(e) => setNewAppointmentTime(e.target.value)}
                />
                <button onClick={addAppointment} className="small-button">
                  Adicionar
                </button>
              </div>
            </div>

            <ul className="list">
              {appointmentsToday.length === 0 && (
                <li className="empty">Nenhum compromisso adicionado</li>
              )}
              {appointmentsToday.map(({ id, text, time }) => (
                <li
                  key={id}
                  className="flex items-center justify-between"
                  style={{ gap: "0.5rem" }}
                >
                  <span style={{ width: 60, fontWeight: "bold" }}>{time}</span>
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
              {files.map((file) => {
                const url = URL.createObjectURL(file);
                return (
                  <li
                    key={file.name}
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
                        onClick={() => {
                          setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
                        }}
                      >
                        {file.name}
                      </a>
                    </span>
                    <button
                      onClick={() => removeFile(file.name)}
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
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
