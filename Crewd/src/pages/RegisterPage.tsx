import { useNavigate } from "react-router";
import { useState } from "react";
import { fetchPublic } from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await fetchPublic("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/");
    } catch (err: any) {
      alert("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl">Registro</h2>
        <input
          placeholder="Nombre"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Correo"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Usuario"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Contraseña"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 p-2 rounded"
        >
          Crear cuenta
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-800 p-2 rounded hover:cursor-pointer"
        >
          Ir a Iniciar sesion
        </button>
      </div>
    </div>
  );
};

export default Register;
