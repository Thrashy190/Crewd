import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { fetchWithToken } from "../services/api";
type Server = { _id: string; name: string; logoUrl?: string };
type User = { _id: string; name: string; email: string };

const MainLayout = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, serverRes] = await Promise.all([
          fetchWithToken("/users/me"),
          fetchWithToken("/servers/my"),
        ]);
        setUser(userRes);
        setServers(serverRes);
      } catch (err) {
        console.error("Fallo al cargar usuario o servidores:", err);
        navigate("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Servidores */}
      <div className="w-[10%] bg-gray-800 p-2 flex flex-col justify-between ">
        <div className="flex flex-col items-center ">
          <button
            className="mb-4 bg-blue-600 px-2 py-1 rounded"
            onClick={async () => {
              const name = prompt("Nombre del servidor");
              if (!name) return;

              try {
                const res = await fetchWithToken("/servers", {
                  method: "POST",
                  body: JSON.stringify({ name }),
                });
                // Redirige automáticamente al nuevo servidor
                navigate(`/home/${res._id}`);
              } catch (err: any) {
                alert("Error al crear servidor: " + err.message);
              }
            }}
          >
            + Servidor
          </button>
          {servers.map((server) => (
            <button
              key={server._id}
              onClick={() => navigate(`/home/${server._id}`)}
              className={` max-w-50 p-4 mb-2 ${
                location.pathname.includes(server._id)
                  ? "bg-blue-600"
                  : "bg-gray-700"
              } flex items-center justify-center hover:bg-blue-500`}
            >
              {server.name}
            </button>
          ))}
        </div>

        <button
          className="w-full mb-2 bg-gray-900 p-2 rounded"
          onClick={() => navigate("/")}
        >
          Cerrar Sesion
        </button>
      </div>

      <div className="flex-1">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default MainLayout;
