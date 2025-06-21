import { useState } from "react";

interface ConnectionFormProps {
  username: string;
  roomId: string;
  isConnecting?: boolean;
  onUsernameChange: (username: string) => void;
  onRoomIdChange: (roomId: string) => void;
  onConnect: () => void;
}

export default function ConnectionForm({
  username,
  roomId,
  onUsernameChange,
  onRoomIdChange,
  onConnect,
}: ConnectionFormProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const handleConnect = () => {
    setIsConnecting(true);
    onConnect();
  };
  return (
    <div
      className="connection-form"
      style={{
        maxWidth: "400px",
        width: "100%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
          disabled={isConnecting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="roomId">Room ID:</label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => onRoomIdChange(e.target.value)}
          placeholder="Enter room ID"
          disabled={isConnecting}
        />
      </div>
      <button
        onClick={onConnect}
        disabled={isConnecting}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {isConnecting && (
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ffffff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
        {isConnecting ? "Connecting..." : "Connect"}
      </button>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
