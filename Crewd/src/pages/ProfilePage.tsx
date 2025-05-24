import { useEffect, useState } from "react";
import { fetchWithToken } from "../services/api";
const Profile = () => {
  const [form, setForm] = useState({ name: "", username: "" });

  useEffect(() => {
    const loadProfile = async () => {
      const user = await fetchWithToken("/users/me");
      setForm({ name: user.name, username: user.username });
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await fetchWithToken("/users/me", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      alert("Perfil actualizado");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h2 className="text-2xl mb-4">Editar perfil</h2>
      <input
        className="w-full p-2 rounded bg-gray-700 mb-2"
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full p-2 rounded bg-gray-700 mb-2"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <button className="bg-blue-600 px-4 py-2 rounded" onClick={handleUpdate}>
        Guardar cambios
      </button>
    </div>
  );
};

export default Profile;
