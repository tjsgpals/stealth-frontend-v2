
import { io } from "socket.io-client";

const SOCKET_URL = "http://119.194.117.120:5000";

// Socket.IO 서버 연결
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
});

// 노트북을 viewer 역할로 등록
export function connectViewer() {
  if (!socket.connected) {
    socket.connect();
  }
}

// 서버 연결 종료
export function disconnectViewer() {
  socket.disconnect();
}