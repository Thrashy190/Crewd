import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { fetchWithToken } from "../services/api";

type Member = {
  _id: string;
  name: string;
};

const ServerChatLayout = () => {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!serverId) return;
      try {
        const res = await fetchWithToken(`/servers/${serverId}/members`);
        setMembers(res);
      } catch (err: any) {
        alert("Error al cargar miembros: " + err.message);
      }
    };
    fetchMembers();
  }, [serverId]);

  const handleAddContact = async () => {
    const email = prompt("Correo del usuario a agregar:");
    if (!email || !serverId) return;

    try {
      const res = await fetchWithToken(`/servers/${serverId}/add-member`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      alert("Usuario agregado correctamente");
      setMembers((prev) => [...prev, res.user]); // opcional, depende de lo que retorne
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar de miembros */}
      <div className="w-[10%] bg-gray-700 p-2 flex justify-between flex-col">
        <div>
          <button
            className="w-full mb-2 bg-gray-900 p-2 rounded"
            onClick={handleAddContact}
          >
            + Contacto
          </button>

          {members.map((c) => (
            <div
              key={c._id}
              className="p-2 cursor-pointer hover:bg-gray-600"
              onClick={() => navigate(`/chat/${c._id}`)}
            >
              {c.name}
            </div>
          ))}
        </div>
        <button
          className="w-full mb-2 bg-gray-900 p-2 rounded"
          onClick={() => navigate("/profile")}
        >
          Ver Perfil
        </button>
      </div>

      {/* Contenido del chat */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ServerChatLayout;
