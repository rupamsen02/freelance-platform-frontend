import { io } from "socket.io-client";

const socket = io("http://localhost:8800", {
  withCredentials: true,
});

export default socket;