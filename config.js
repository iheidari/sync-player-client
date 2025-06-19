// Configuration file for the chat application
const config = {
  // Socket.IO server URL - change this to match your server
  SOCKET_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://sync-player-server.onrender.com",

  // You can add other configuration options here
  // DEBUG_MODE: false,
  // MAX_MESSAGE_LENGTH: 1000,
};

// Make config available globally
window.config = config;
