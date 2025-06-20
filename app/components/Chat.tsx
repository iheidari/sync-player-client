"use client";

import { useRef, useEffect } from "react";

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  isConnected: boolean;
  messages: Message[];
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function Chat({
  isConnected,
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  const handleMessageKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSendMessage();
    }
  };

  return (
    <>
      <div className={`status ${isConnected ? "connected" : "disconnected"}`}>
        {isConnected ? "Connected" : "Disconnected"}
      </div>

      <div className="chat-container">
        <h3>Chat</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <span className="username">{msg.username}</span>
              <span className="time">
                [{new Date(msg.timestamp).toLocaleTimeString()}]
              </span>
              <span className="content">: {msg.message}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyDown={handleMessageKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={onSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
