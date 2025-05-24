import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { api } from "../services/api";

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
          api.get("/users/me"),
          api.get("/servers/my"),
        ]);
        setUser(userRes.data);
        setServers(serverRes.data);
      } catch (err) {
        navigate("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Servidores */}
      <div className="w-[10%] bg-gray-800 p-2 flex flex-col items-center">
        <button className="mb-4 bg-blue-600 px-2 py-1 rounded">
          + Servidor
        </button>
        {servers.map((server) => (
          <button
            key={server._id}
            onClick={() => navigate(`/home/${server._id}`)}
            className={`w-12 h-12 rounded-full mb-2 ${
              location.pathname.includes(server._id)
                ? "bg-blue-600"
                : "bg-gray-700"
            } flex items-center justify-center hover:bg-blue-500`}
          >
            {server.name[0].toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default MainLayout;
