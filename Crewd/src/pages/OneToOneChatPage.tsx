import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { socket } from "../services/socket";
import { api } from "../services/api";

type Message = {
  _id: string;
  content: string;
  sender: { name: string };
};

const OneToOneChat = () => {
  const { userId } = useParams(); // ID del otro usuario
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    const fetchUserAndGenerateChannel = async () => {
      const res = await api.get("/users/me");
      setCurrentUser(res.data);

      const ids = [res.data._id, userId].sort();
      const combined = ids.join("-");
      setChannelId(combined);

      // Aquí puedes usar un endpoint real tipo /messages/direct/:userId
      const messagesRes = await api.get(`/messages/${combined}`);
      setMessages(messagesRes.data);

      socket.connect();
      socket.emit("join_channel", combined);
      socket.on("receive_message", (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("receive_message");
      };
    };

    fetchUserAndGenerateChannel();
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await api.post(`/messages/${channelId}`, { content: newMessage });
    socket.emit("send_message", {
      channelId,
      content: newMessage,
      sender: { name: currentUser?.name || "Tú" },
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top */}
      <div className="p-4 bg-gray-800">
        <h2>Chat con {userId}</h2>
      </div>

      {/* Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-gray-700 p-2 rounded">
            <strong>{msg.sender.name}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mensaje..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default OneToOneChat;
