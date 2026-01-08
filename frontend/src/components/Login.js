import { useState } from "react";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);

    if (res.token) {
      localStorage.setItem("token", res.token);
      onLogin(res.token);
    } else {
      alert("Login inválido");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Usuário" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      <button>Entrar</button>
    </form>
  );
}
