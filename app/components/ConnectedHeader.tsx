import React from "react";

type Props = {
  currentUser: string;
  currentRoom: string;
  leaveRoom: () => void;
};

const ConnectedHeader = (props: Props) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <span className="header-username">
          {props.currentUser ?? "Username"}
        </span>
        <span className="header-room-id">Room: {props.currentRoom ?? ""}</span>
      </div>
      <div className="header-right">
        <button onClick={props.leaveRoom}>Leave Room</button>
      </div>
    </header>
  );
};

export default ConnectedHeader;
