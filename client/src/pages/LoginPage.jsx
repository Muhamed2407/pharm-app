import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

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
