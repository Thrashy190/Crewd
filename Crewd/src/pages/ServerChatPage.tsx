import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { socket } from "../services/socket";
import { fetchWithToken } from "../services/api";

type Channel = { _id: string; name: string };
type Message = { _id: string; content: string; sender: { name: string } };

const ServerChat = () => {
  const { serverId } = useParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const loadChannels = async () => {
      const ch = await fetchWithToken(`/channels/${serverId}`);
      setChannels(ch);
      if (ch.length > 0) setSelectedChannelId(ch[0]._id);
    };
    loadChannels();
  }, [serverId]);

  useEffect(() => {
    if (!selectedChannelId) return;

    const loadMessages = async () => {
      const msgs = await fetchWithToken(`/messages/${selectedChannelId}`);
      setMessages(msgs);
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

    await fetchWithToken(`/messages/${selectedChannelId}`, {
      method: "POST",
      body: JSON.stringify({ content: newMessage }),
    });

    socket.emit("send_message", {
      channelId: selectedChannelId,
      content: newMessage,
      sender: { name: "Tú" },
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 flex items-center gap-4">
        <button
          className="ml-2 bg-gray-700 px-2 py-1 rounded"
          onClick={async () => {
            const name = prompt("Nombre del nuevo canal");
            if (!name || !serverId) return;

            try {
              const newChannel = await fetchWithToken(`/channels/${serverId}`, {
                method: "POST",
                body: JSON.stringify({ name }),
              });
              setChannels((prev) => [...prev, newChannel]);
              setSelectedChannelId(newChannel._id);
            } catch (err: any) {
              alert("Error al crear canal: " + err.message);
            }
          }}
        >
          + Canal
        </button>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-gray-700 p-2 rounded">
            <strong>{msg.sender.name}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

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
