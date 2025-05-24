import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchPublic } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetchPublic("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.access_token);
      navigate("/home");
    } catch (err: any) {
      alert("Error de login: " + err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl">Inicio de Sesión</h2>
        <input
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-gray-800 p-2 rounded hover:cursor-pointer"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Login;
