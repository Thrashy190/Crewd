// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import OneToOneChat from "./pages/OneToOneChatPage";
import ServerChat from "./pages/ServerChatPage";
import MainLayout from "./layout/layout";
import ServerChatLayout from "./layout/serverLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:userId" element={<OneToOneChat />} />
          <Route path="/profile" element={<Profile />} />

          <Route element={<ServerChatLayout />}>
            <Route path="/home/:serverId" element={<ServerChat />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
