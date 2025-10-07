import { useState } from "react";
import { api, setAuth } from "../api";
import "../css/login.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        setAuth(data.token);
        location.href = "/dashboard";
      } else {
        // REGISTER
        const { data } = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
        setAuth(data.token);
        location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err?.response?.data?.Message || "Error en la autenticación");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="auth-input"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="auth-input"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="auth-input"
          />

          <button type="submit" className="auth-button">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-toggle">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}
