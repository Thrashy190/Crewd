import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchWithToken } from "../services/api";

type Server = { _id: string; name: string };
type User = { _id: string; name: string };

const Home = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetchWithToken("/users/me");
        const serversRes = await fetchWithToken("/servers/my");
        setUser(userRes);
        setServers(serversRes);
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-full items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl">¡Hola, {user?.name || "Cargando"}!</h1>
    </div>
  );
};

export default Home;
