"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ConnectionForm from "./components/ConnectionForm";
import Connected from "./components/Connected";
import ConnectedHeader from "./components/ConnectedHeader";

interface User {
  username: string;
}

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [newCommandTime, setNewCommandTime] = useState(new Date().getTime());

  const log = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry: Message = { message, timestamp, username: "Server" };
    setMessages((prev) => [...prev, logEntry]);
  };

  const connect = () => {
    if (!username || !roomId) {
      alert("Please enter both username and room ID");
      return;
    }

    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      log("Connected to server");
      setIsConnected(true);
      setCurrentUser(username);
      setCurrentRoom(roomId);

      // Join room
      newSocket.emit("join-room", { roomId, username });
    });

    newSocket.on("disconnect", () => {
      log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("room-state", (data: { users: User[] }) => {
      log(
        `Joined room. Users: ${data.users.map((u) => u.username).join(", ")}`
      );
    });

    newSocket.on("user-joined", (data: { username: string }) => {
      log(`${data.username} joined the room`);
    });

    newSocket.on("user-left", (data: { username: string }) => {
      log(`${data.username} left the room`);
    });

    newSocket.on("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
      interpretMessage(data.message);
    });

    newSocket.on(
      "user-typing",
      (data: { username: string; isTyping: boolean }) => {
        if (data.isTyping) {
          log(`${data.username} is typing...`);
        }
      }
    );

    setSocket(newSocket);
  };

  const interpretMessage = (message: string) => {
    if (message.startsWith("/")) {
      setNewCommandTime(new Date().getTime());
    }
    const [command, ...args] = message.split(" ");
    switch (command) {
      case "/load": {
        const url = args.join(" ");
        if (url) {
          setVideoUrl(url);
        }
        break;
      }
      case "/play": {
        if (videoRef.current) {
          const timeArg = args[0];
          if (timeArg && !isNaN(parseFloat(timeArg))) {
            videoRef.current.currentTime = parseFloat(timeArg);
          }
          videoRef.current.play();
        }
        break;
      }
      case "/pause": {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        break;
      }
    }
  };

  const sendMessage = (message?: string) => {
    if (new Date().getTime() - newCommandTime < 500) {
      return;
    }
    if ((message || messageInput.trim()) && socket && currentRoom) {
      socket.emit("send-message", {
        roomId: currentRoom,
        message: message || messageInput.trim(),
      });
      setMessageInput("");
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leave-room");
      socket.disconnect();
    }

    setIsConnected(false);
    setCurrentRoom(null);
    setCurrentUser(null);
    setMessages([]);
    setUsername("");
    setRoomId("");
    log("Left room and disconnected");
  };

  if (isConnected) {
    return (
      <div className="container">
        <ConnectedHeader
          currentUser={currentUser ?? ""}
          currentRoom={currentRoom ?? ""}
          leaveRoom={leaveRoom}
        />
        <Connected
          isConnected={isConnected}
          messages={messages}
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          onSendMessage={sendMessage}
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          videoRef={videoRef}
        />
      </div>
    );
  }

  return (
    <ConnectionForm
      username={username}
      roomId={roomId}
      onUsernameChange={setUsername}
      onRoomIdChange={setRoomId}
      onConnect={connect}
    />
  );
}
