import React, { useState, useEffect } from "react";
import Lobby from './components/Lobby'
import Room from './components/Room'
import EndScreen from './components/EndScreen'
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
  const [roomTimer, setRoomTimer] = useState();
  // should come from server eventually
  const [roomData, setRoomData] = useState({});
  const [playerUsername, setPlayerUsername] = useState("");

  const [mySocket, setMySocket] = useState();

  const [lobbyShown, setLobbyShown] = useState(true);
  const [roomShown, setRoomShown] = useState(false);
  const [endScreenShown, setEndScreenShown] = useState(false);

  function showLobby() { setLobbyShown(true); setRoomShown(false); setEndScreenShown(false)}
  function showRoom() { setLobbyShown(false); setRoomShown(true); setEndScreenShown(false)}
  function showEndScreen() { setLobbyShown(false); setRoomShown(false); setEndScreenShown(true)}

  useEffect(() => {
    // const socket = io(); // for prod
    const socket = socketIOClient(ENDPOINT); // for dev
    setMySocket(socket)

    socket.on('lobby players', function(players) {
      setLobbyPlayers(players)

      let playerUsername = "test"

      for (var key in players) {
        if (key == socket.id) {
          playerUsername = players[key]
        }
      }

      setPlayerUsername(playerUsername)
    })

    socket.on('in room', function(room, roomData, timer) {
      setRoomId(room)
      setRoomData(roomData)
      setRoomTimer(timer)
      showRoom()
    })

    socket.on('update game', function(roomData) {
      setRoomData(roomData)
    })

    socket.on("end game", function(roomData) {
      setRoomData(roomData)
      showEndScreen()
    })

  }, []);

  return (
    <div className="app-container">
      <div id="screen-picker">
        <button onClick={showLobby}>L</button>
        <button onClick={showRoom}>R</button>
        <button onClick={showEndScreen}>E</button>
      </div>
      <TitleDisplay></TitleDisplay>
      {lobbyShown ?
      <Lobby
        socket={mySocket}
        playerUsername={playerUsername}
        lobbyPlayers={lobbyPlayers}
      ></Lobby>
      : <></>}
      {roomShown ?
      <Room socket={mySocket} roomId={roomId} roomData={roomData} roomTimer={roomTimer}></Room>
      : <></>}
      {endScreenShown ?
      <EndScreen
        socket={mySocket}
        roomData={roomData}
        showLobby={showLobby}  
      ></EndScreen>
      : <></>}

    </div>
  );
}

export default App;