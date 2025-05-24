import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../services/api";
import { socket } from "../services/socket";

type Channel = { _id: string; name: string };
type Message = { _id: string; content: string; sender: { name: string } };

const ServerChat = () => {
  const { serverId } = useParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const loadChannels = async () => {
      const res = await api.get(`/channels/${serverId}`);
      setChannels(res.data);
      if (res.data.length > 0) {
        setSelectedChannelId(res.data[0]._id);
      }
    };
    loadChannels();
  }, [serverId]);

  useEffect(() => {
    if (!selectedChannelId) return;

    const loadMessages = async () => {
      const res = await api.get(`/messages/${selectedChannelId}`);
      setMessages(res.data);
    };

    loadMessages();

    socket.connect();
    socket.emit("join_channel", selectedChannelId);
    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedChannelId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await api.post(`/messages/${selectedChannelId}`, { content: newMessage });
    socket.emit("send_message", {
      channelId: selectedChannelId,
      content: newMessage,
      sender: { name: "Tú" }, // Opcional: mostrar nombre directamente
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* TopBar */}
      <div className="flex items-center p-4 bg-gray-800">
        <select
          className="bg-gray-700 text-white p-2 rounded"
          onChange={(e) => setSelectedChannelId(e.target.value)}
          value={selectedChannelId}
        >
          {channels.map((ch) => (
            <option key={ch._id} value={ch._id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ServerChat;
