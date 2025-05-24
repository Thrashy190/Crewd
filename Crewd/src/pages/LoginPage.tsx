import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/home");
    } catch (err) {
      alert("Login fallido");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl">Inicio de Sesión</h2>
        <input
          className="w-full p-2 rounded"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          placeholder="Contraseña"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
