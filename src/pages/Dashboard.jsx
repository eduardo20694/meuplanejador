// src/pages/Dashboard.jsx
import React, { useState } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    'Responder emails',
    'Reunião com time às 14h',
    'Revisar código do projeto',
  ]);

  const [appointments, setAppointments] = useState([
    'Dentista às 10h',
    'Almoço com cliente às 12h',
  ]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <section>
        <h2>Tarefas Diárias</h2>
        <ul>
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Compromissos Diários</h2>
        <ul>
          {appointments.map((appt, i) => (
            <li key={i}>{appt}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
