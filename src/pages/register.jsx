import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const response = await fetch("https://apirest-production-b815.up.railway.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao cadastrar");
        return;
      }

      setSucesso("Cadastro realizado com sucesso! Você será redirecionado para login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErro("Erro na requisição");
    }
  };

  return (
    <div className="login-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
    </div>
  );
}
