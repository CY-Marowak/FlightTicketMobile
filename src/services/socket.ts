import { io } from "socket.io-client";

const SOCKET_URL = "https://flightticketproject.onrender.com/";

export const socket = io(SOCKET_URL, {
    autoConnect: false, // 初始不連線 讓 Context 來控制連線時機
    transports: ["websocket"], // 強制使用 websocket 避免 long-polling 延遲
});