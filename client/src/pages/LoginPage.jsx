import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const rolePresets = {
  client: { email: "user@pharmapp.kz", password: "user12345", label: "Клиент" },
  courier: { email: "courier@pharmapp.kz", password: "courier123", label: "Курьер" },
  admin: { email: "admin@pharmapp.kz", password: "admin123", label: "Админ" },
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [roleChoice, setRoleChoice] = useState("client");

  const chooseRole = (role) => {
    setRoleChoice(role);
    setEmail(rolePresets[role].email);
    setPassword(rolePresets[role].password);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(email, password);
      if (u.role === "admin") navigate("/admin");
      else if (u.role === "courier") navigate("/courier");
      else navigate("/panel/orders");
    } catch {
      setError("Кіру қатесі");
    }
  };

  return (
    <main className="container">
      <h1>Кіру</h1>
      <div className="role-choice card">
        <p className="role-choice-title">Кім ретінде кіресіз?</p>
        <div className="role-choice-buttons">
          <button type="button" className={roleChoice === "client" ? "pill active" : "pill"} onClick={() => chooseRole("client")}>
            Клиент
          </button>
          <button type="button" className={roleChoice === "courier" ? "pill active" : "pill"} onClick={() => chooseRole("courier")}>
            Курьер
          </button>
          <button type="button" className={roleChoice === "admin" ? "pill active" : "pill"} onClick={() => chooseRole("admin")}>
            Админ
          </button>
        </div>
      </div>
      <form className="card form" onSubmit={submit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Құпиясөз" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Кіру</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
};

export default LoginPage;
