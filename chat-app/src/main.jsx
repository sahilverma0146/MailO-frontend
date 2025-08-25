import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// IMPORTS
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/isAuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
