import { Outlet, useNavigate } from "react-router";

const dummyContacts = [
  { id: "u1", name: "Juan" },
  { id: "u2", name: "Ana" },
];

const ServerChatLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar de miembros/contactos del servidor */}
      <div className="w-[10%] bg-gray-700 p-2 ">
        <button className="w-full mb-2 bg-gray-900 p-2 rounded">
          + Contacto
        </button>
        {dummyContacts.map((c) => (
          <div
            key={c.id}
            className="p-2 cursor-pointer hover:bg-gray-600"
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* Contenido del chat del servidor */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ServerChatLayout;
