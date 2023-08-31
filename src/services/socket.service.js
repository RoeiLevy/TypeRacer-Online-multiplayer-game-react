import { io } from "socket.io-client";

let socket
if (process.env.NODE_ENV === 'production') {
  socket = io('https://type-racer-6n4q.onrender.com');
} else {
  socket = io('http://localhost:8080');
}


const on = (eventType, cb) => {
  socket.on(eventType, cb)
}

const off = (eventType, cb) => {
  if (!socket) return;
  if (!cb) socket.removeAllListeners(eventType)
  else socket.off(eventType, cb)
}

const emit = (eventType, data) => {
  socket.emit(eventType, data)
}

export const socketService = {
  on, emit, off
}