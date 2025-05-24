import { useEffect, useState } from "react";
import { api } from "../services/api";

const Profile = () => {
  const [_, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", username: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
      setForm({ name: res.data.name, username: res.data.username });
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.patch("/users/me", form);
      alert("Perfil actualizado correctamente");
    } catch {
      alert("Error al actualizar perfil");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h2 className="text-2xl mb-4">Editar perfil</h2>
      <div className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded"
          onClick={handleUpdate}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default Profile;
