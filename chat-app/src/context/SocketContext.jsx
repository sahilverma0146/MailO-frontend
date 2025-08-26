import { createContext, useContext, useEffect, useState } from "react";
import { chat_Service } from "./isAuthContext";
import { io } from "socket.io-client";

import { useAppData } from "./isAuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { user, loading } = useAppData();

  console.log("SocketContext - User:", user);
  console.log("SocketContext - Loading:", loading);

  useEffect(() => {
    console.log(onlineUsers, "😡");

    // Don't create socket if still loading or if user is not available
    if (loading || !user) {
      console.log("SocketContext - Waiting for user data to load...");
      return;
    }

    console.log(
      "SocketContext - Creating socket connection for user 🤣:",
      user.user?._id
    );

    // PROD CHNGES BECAUSE THE
    // Connect to Vercel serverless proxy for WebSocket
    // const newSocket = io("/api/socket", {
    //   path: "/api/socket",
    //   query: { userId: user.user?._id },
    // });

    const newSocket = io("wss://3.110.174.233:5003", {
      query: { userId: user.user?._id },
    });

    // Socket connection events
    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("getOnlineUsers", (onlineUsers) => {
      console.log("ONLINE USERS:", onlineUsers);
      setOnlineUsers(onlineUsers);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      console.log("SocketContext - Cleaning up socket connection");
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, loading]); // Dependencies: user and loading

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
