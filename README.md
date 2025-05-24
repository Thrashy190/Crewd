

# 🛰️ Discord Clone - Plataforma de Chat Grupal y 1v1

Una aplicación web inspirada en Discord, que permite a usuarios crear servidores, canales, enviar mensajes en tiempo real a través de WebSockets, y mantener conversaciones privadas o grupales. Desarrollada con:

- ⚙️ Backend: NestJS + MongoDB (Mongoose)
- 🌐 Frontend: React (Vite + TS) + TailwindCSS + Socket.IO
- 🐳 Dockerizado (frontend, backend y base de datos MongoDB)

---

## 📦 Estructura del Proyecto

```bash
/Crewd
├── backend        # API REST + WebSocket Gateway (NestJS)
├── frontend       # Aplicación Web (React + Vite)
├── docker-compose.yml
└── README.md
```

---

## 🔐 Funcionalidades principales

- Registro e inicio de sesión (con JWT)
- Crear servidores y unirse a ellos
- Crear canales de texto dentro de servidores
- Enviar mensajes en tiempo real
- Chats privados 1 a 1
- Gestión de perfil personal
- Diseño responsivo y estilizado tipo Discord

---

## 🧠 Módulos del Backend

### `/auth`
- `POST /auth/register`: crear nuevo usuario
- `POST /auth/login`: iniciar sesión (devuelve token JWT)

### `/users`
- `GET /users/me`: obtener datos del usuario actual
- `PATCH /users/me`: actualizar perfil del usuario

### `/servers`
- `GET /servers/my`: listar servidores del usuario
- `POST /servers`: crear servidor
- `POST /servers/:id/join`: unirse a servidor existente

### `/channels`
- `GET /channels/:serverId`: listar canales de texto
- `POST /channels/:serverId`: crear canal en servidor

### `/messages`
- `GET /messages/:channelId`: obtener mensajes de un canal
- `POST /messages/:channelId`: enviar mensaje a un canal

---

## ⚡ WebSockets (`/chat` Gateway)

- `send_message`: envía mensaje en tiempo real a canal
- `receive_message`: recibe mensajes en el canal actual
- `join_channel`: unirse a una sala WebSocket (canal)

---

## 🎨 Vistas del Frontend

### `Login` `/`
Formulario para iniciar sesión. Guarda el token JWT.

### `Register` `/register`
Formulario para registrar un nuevo usuario.

### `Home` `/home`
Dashboard principal. Muestra tus servidores, contactos y bienvenida.

### `ServerChat` `/home/:serverId`
Lista de canales del servidor. Chat grupal en tiempo real.

### `OneToOneChat` `/chat/:userId`
Conversación privada 1 a 1 en tiempo real.

### `Profile` `/profile`
Editar nombre, username y avatar.

---

## 🚀 Cómo ejecutar el proyecto con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/discord-clone.git
cd discord-clone
````

### 2. Construir y ejecutar los servicios

```bash
docker-compose up --build
```

Esto iniciará:

* `frontend` en `http://localhost:5173`
* `backend` en `http://localhost:3000`
* `mongodb` persistente en volumen local

### 3. Primer uso

1. Abre tu navegador y ve a: `http://localhost:5173`
2. Registra un nuevo usuario
3. Crea un servidor
4. Crea canales y comienza a enviar mensajes
5. Invita o simula otros usuarios para pruebas 1 a 1

---

## ⚙️ Variables de entorno relevantes

### `backend/.env` (si decides usar archivo)

```env
MONGODB_URI=mongodb://mongodb:27017/discord-clone
JWT_SECRET=tu_secreto
NODE_ENV=development
```

---

## 🧪 Tecnologías Usadas

* NestJS + Mongoose + Swagger
* JWT + bcrypt + Passport
* WebSockets (Socket.IO Gateway)
* React + TailwindCSS + Zustand + Vite
* Docker + Docker Compose

---
