let socket;
let currentRoom = null;
let currentUser = null;

function log(message) {
  const logElement = document.getElementById("log");
  const timestamp = new Date().toLocaleTimeString();
  logElement.innerHTML += `[${timestamp}] ${message}<br>`;
  logElement.scrollTop = logElement.scrollHeight;
}

function updateRoomInfo(users) {
  const roomDetails = document.getElementById("roomDetails");
  roomDetails.innerHTML = `
        <p><strong>Room ID:</strong> ${currentRoom}</p>
        <p><strong>Connected Users:</strong> ${users.length}</p>
        <p><strong>Users:</strong> ${users
          .map((u) => u.username)
          .join(", ")}</p>
    `;
}

function connect() {
  const username = document.getElementById("username").value;
  const roomId = document.getElementById("roomId").value;

  if (!username || !roomId) {
    alert("Please enter both username and room ID");
    return;
  }

  socket = io("http://localhost:3000");

  socket.on("connect", () => {
    log("Connected to server");
    document.getElementById("status").textContent = "Connected";
    document.getElementById("status").className = "status connected";
    document.getElementById("status").style.display = "block";
    document.getElementById("roomInfo").style.display = "block";
    document.getElementById("controls").style.display = "block";
    document.getElementById("chatContainer").style.display = "block";
    document.getElementById("connectionForm").style.display = "none";

    // Join room
    socket.emit("join-room", { roomId, username });
    currentRoom = roomId;
    currentUser = username;
  });

  socket.on("disconnect", () => {
    log("Disconnected from server");
    document.getElementById("status").textContent = "Disconnected";
    document.getElementById("status").className = "status disconnected";
  });

  socket.on("room-state", (data) => {
    log(`Joined room. Users: ${data.users.map((u) => u.username).join(", ")}`);
    updateRoomInfo(data.users);
  });

  socket.on("user-joined", (data) => {
    log(`${data.username} joined the room`);
    // Update room info with the new user count from the server
    // The server will send updated room state to all users
  });

  socket.on("user-left", (data) => {
    log(`${data.username} left the room`);
    // Update room info with the new user count from the server
    // The server will send updated room state to all users
  });

  socket.on("new-message", (data) => {
    const messagesDiv = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.innerHTML = `
            <span class="username">${data.username}</span>: ${data.message}
            <div class="time">${new Date(
              data.timestamp
            ).toLocaleTimeString()}</div>
        `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  socket.on("user-typing", (data) => {
    if (data.isTyping) {
      log(`${data.username} is typing...`);
    }
  });
}

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();

  if (message) {
    socket.emit("send-message", {
      roomId: currentRoom,
      message: message,
    });
    messageInput.value = "";
  }
}

function handleMessageKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function leaveRoom() {
  socket.emit("leave-room");
  socket.disconnect();

  document.getElementById("status").style.display = "none";
  document.getElementById("roomInfo").style.display = "none";
  document.getElementById("controls").style.display = "none";
  document.getElementById("chatContainer").style.display = "none";
  document.getElementById("connectionForm").style.display = "block";

  currentRoom = null;
  currentUser = null;
  log("Left room and disconnected");
}

// Initialize typing indicator when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Handle typing indicator
  let typingTimeout;
  const messageInput = document.getElementById("messageInput");

  if (messageInput) {
    messageInput.addEventListener("input", () => {
      if (socket && currentRoom) {
        socket.emit("typing", {
          roomId: currentRoom,
          isTyping: true,
        });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          socket.emit("typing", {
            roomId: currentRoom,
            isTyping: false,
          });
        }, 1000);
      }
    });
  }
});
