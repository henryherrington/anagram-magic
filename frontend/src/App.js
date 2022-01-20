import React, { useState, useEffect } from "react";
import Lobby from './components/Lobby'
import Room from './components/Room'
import TitleDisplay from "./components/TitleDisplay";

import './App.css';

// for prod
// import { io } from "socket.io-client"

// for dev
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

function App() {
  const [lobbyPlayers, setLobbyPlayers] = useState({});
  const [roomId, setRoomId] = useState();

  const [roomData, setRoomData] = useState({});
  const [playerData, setPlayerData] = useState({});

  const [mySocket, setMySocket] = useState();

  const [lobbyShown, setLobbyShown] = useState(true);
  const [roomShown, setRoomShown] = useState(false);

  function showLobby() { setLobbyShown(true); setRoomShown(false);}
  function showRoom() { setLobbyShown(false); setRoomShown(true);}

  useEffect(() => {
    // const socket = io(); // for prod
    const socket = socketIOClient(ENDPOINT); // for dev
    setMySocket(socket)

    socket.on('lobby players', function(players) {
      console.log(players)
      
      setLobbyPlayers(players)
      let playerData = {}

      for (var key in players) {
        if (key == socket.id) {
          playerData = players[key]
        }
      }

      setPlayerData(playerData)
    })

    socket.on('in room', function(room, roomData) {
      setRoomId(room)
      setRoomData(roomData)
      showRoom()
    })

    socket.on('update game', function(roomData) {
      setRoomData(roomData)
    })
  }, []);

  return (
    <div className="app-container">
      <div id="screen-picker">
        <button onClick={showLobby}>L</button>
        <button onClick={showRoom}>R</button>
      </div>
      <TitleDisplay></TitleDisplay>
      {lobbyShown ?
      <Lobby
        socket={mySocket}
        playerData={playerData}
        lobbyPlayers={lobbyPlayers}
      ></Lobby>
      : <></>}
      {roomShown ?
      <Room
        socket={mySocket}
        roomId={roomId}
        roomData={roomData}
        showLobby={showLobby}  
      ></Room>
      : <></>}
    </div>
  );
}

export default App;