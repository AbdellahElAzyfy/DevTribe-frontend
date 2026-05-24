import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const EXPLICIT_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

function resolveSocketUrl() {
  if (EXPLICIT_SOCKET_URL) {
    return EXPLICIT_SOCKET_URL;
  }
  if (!API_URL) {
    return undefined;
  }
  return API_URL.replace(/\/api\/v\d+\/?$/, "");
}

let socket = null;

export function connectSocket(token) {
  if (!token) {
    return null;
  }

  if (socket) {
    if (socket.auth?.token !== token) {
      socket.auth = { token };
      if (socket.connected) {
        socket.disconnect();
      }
      socket.connect();
    } else if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(resolveSocketUrl(), {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect_error", (err) => {
    const code = err?.data?.code;
    if (code === "AUTH_REQUIRED" || code === "INVALID_TOKEN") {
      socket?.disconnect();
    }
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}

export function onSocketEvent(event, handler) {
  if (!socket) {
    return () => {};
  }
  socket.on(event, handler);
  return () => {
    socket?.off(event, handler);
  };
}
