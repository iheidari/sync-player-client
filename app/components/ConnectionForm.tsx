interface ConnectionFormProps {
  username: string;
  roomId: string;
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
  return (
    <div className="connection-form">
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
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
        />
      </div>
      <button onClick={onConnect}>Connect</button>
    </div>
  );
}
