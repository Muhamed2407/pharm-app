import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.fullName, form.email, form.password);
      navigate("/panel/orders");
    } catch {
      setError("Тіркелу қатесі");
    }
  };

  return (
    <main className="container">
      <h1>Тіркелу</h1>
      <form className="card form" onSubmit={submit}>
        <input className="input" placeholder="Аты-жөні" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Құпиясөз" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Тіркелу</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
};

export default RegisterPage;
