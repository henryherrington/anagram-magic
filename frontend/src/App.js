import React, { useState, useEffect } from "react";
import Lobby from './components/Lobby'
import Room from './components/Room'


// for prod
// import { io } from "socket.io-client"

// for dev
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

function App() {
  const [lobbyPlayers, setLobbyPlayers] = useState({});

  useEffect(() => {
    // const socket = io(); // for prod
    const socket = socketIOClient(ENDPOINT); // for dev

    socket.on('lobby players', function(usernames) {
      setLobbyPlayers(usernames)
      console.log(usernames)
    })
  }, []);

  return (
    <div>
      <Lobby lobbyPlayers={lobbyPlayers}></Lobby>
      <Room></Room>
    </div>
  );
}

export default App;