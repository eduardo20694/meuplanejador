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

  function addTask() {
    if (!newTask.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: newTask.trim(), done: false, date: new Date(selectedDate) },
    ]);
    setNewTask("");
  }

  function addAppointment() {
    if (!newAppointment.trim()) return;
    setAppointments(prev => [
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
  }

  function toggleTaskDone(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function removeAppointment(id) {
    setAppointments(prev => prev.filter(appt => appt.id !== id));
  }

  const tasksToday = tasks.filter(task => isSameDay(task.date, selectedDate));
  const appointmentsToday = appointments.filter(appt => isSameDay(appt.date, selectedDate));

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
    <div className="flex h-screen bg-gray-100 text-gray-800" style={{ flexDirection: "column" }}>
      <header style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#f9fafb"
      }}>
        <button onClick={goPrevDay} style={{ padding: "0.3rem 0.8rem" }}>{"<"}</button>
        <strong style={{ fontSize: 18 }}>{formatDateBR(selectedDate)}</strong>
        <button onClick={goNextDay} style={{ padding: "0.3rem 0.8rem" }}>{">"}</button>
      </header>

      <main className="content" style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
        <h2 className="main-title">Painel Principal</h2>

        <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          {/* Tarefas */}
          <section className="card">
            <h3>Tarefas para {formatDateBR(selectedDate)}</h3>
            {/* Aqui usamos inputs-group */}
            <div className="inputs-group mb-4">
              <input
                type="text"
                placeholder="Nova tarefa"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <button onClick={addTask} className="label-button">
                Adicionar
              </button>
            </div>
            <ul className="list">
              {tasksToday.length === 0 && <li className="empty">Nenhuma tarefa adicionada</li>}
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
            <div className="inputs-group mb-4">
              <input
                type="text"
                placeholder="Novo compromisso"
                value={newAppointment}
                onChange={e => setNewAppointment(e.target.value)}
              />
              <input
                type="time"
                value={newAppointmentTime}
                onChange={e => setNewAppointmentTime(e.target.value)}
              />
              <button onClick={addAppointment} className="label-button bg-green-600">
                Adicionar
              </button>
            </div>
            <ul className="list">
              {appointmentsToday.length === 0 && <li className="empty">Nenhum compromisso adicionado</li>}
              {appointmentsToday.map(({ id, text, time }) => (
                <li key={id} className="flex items-center justify-between" style={{ gap: "0.5rem" }}>
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
              {files.map(file => {
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
