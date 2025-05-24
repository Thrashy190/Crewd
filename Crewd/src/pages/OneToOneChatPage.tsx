import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { socket } from "../services/socket";
import { fetchWithToken } from "../services/api";

type Message = {
  _id: string;
  content: string;
  sender: { name: string };
};

const OneToOneChat = () => {
  const { userId } = useParams(); // ID del otro usuario
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [channelId, setChannelId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const setupChat = async () => {
      const user = await fetchWithToken("/users/me");
      setCurrentUser(user);

      const ids = [user._id, userId!].sort(); // combinar IDs
      const generatedChannelId = ids.join("-");
      setChannelId(generatedChannelId);

      const msgs = await fetchWithToken(`/messages/${generatedChannelId}`);
      setMessages(msgs);

      socket.connect();
      socket.emit("join_channel", generatedChannelId);
      socket.on("receive_message", (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("receive_message");
      };
    };

    setupChat();
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetchWithToken(`/messages/${channelId}`, {
      method: "POST",
      body: JSON.stringify({ content: newMessage }),
    });

    socket.emit("send_message", {
      channelId,
      content: newMessage,
      sender: { name: currentUser?.name || "Tú" },
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="p-4 bg-gray-800">
        <h2>Chat 1 a 1</h2>
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
