import { useOutletContext } from "react-router";

type User = {
  _id: string;
  name: string;
  email: string;
};

const Home = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div className="flex h-full items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl">¡Hola, {user?.name || "cargando"}!</h1>
    </div>
  );
};

export default Home;
