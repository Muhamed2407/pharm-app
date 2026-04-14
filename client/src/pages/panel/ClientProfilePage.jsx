import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ClientProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
  }, [user]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await updateProfile({ name, phone });
      setMsg("Сақталды");
    } catch {
      setErr("Сақтау мүмкін болмады");
    }
  };

  return (
    <div className="panel-section">
      <h2 className="panel-heading">Профиль</h2>
      <p className="muted panel-email"><strong>Email:</strong> {user?.email} (өзгермейді)</p>
      <form className="form profile-form" onSubmit={submit}>
        <label className="field-label" htmlFor="profile-name">Аты-жөні</label>
        <input
          id="profile-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="field-label" htmlFor="profile-phone">Телефон</label>
        <input
          id="profile-phone"
          className="input"
          placeholder="+7 700 000 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Сақтау</button>
      </form>
      {msg && <p className="notice">{msg}</p>}
      {err && <p className="panel-error">{err}</p>}
    </div>
  );
};

export default ClientProfilePage;
