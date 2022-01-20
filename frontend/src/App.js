import React, { useState, useEffect } from "react";
import Lobby from './components/Lobby'
import LobbyAlt from "./components/LobbyAlt";
import Room from './components/Room'
import TitleDisplay from "./components/TitleDisplay";
import IconButtonRow from "./components/IconButtonRow";

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

  const [screenShown, setScreenShown] = useState("lobby");

  useEffect(() => {
    // const socket = io(); // for prod
    const socket = socketIOClient(ENDPOINT); // for dev
    setMySocket(socket)

    socket.on('lobby players', function(players) {
      
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
      setScreenShown("room")
    })

    socket.on('update game', function(roomData) {
      setRoomData(roomData)
      console.log(roomData)
    })
  }, []);

  return (
    <div className="app-container">
      {/* <div id="screen-picker">
        <button onClick={showLobby}>L</button>
        <button onClick={showRoom}>R</button>
      </div> */}
      <div className="centered-content">
        {(screenShown == "lobby") ?
        <Lobby
          socket={mySocket}
          playerData={playerData}
          lobbyPlayers={lobbyPlayers}
          setScreenShown={setScreenShown}
        ></Lobby>
        // <LobbyAlt></LobbyAlt>
        : <></>}
        {(screenShown == "room") ?
        <Room
          socket={mySocket}
          roomId={roomId}
          roomData={roomData}
          setScreenShown={setScreenShown}  
        ></Room>
        : <></>}
        {(screenShown == "about" || screenShown == "profile") ?
        <LobbyAlt
          contents={screenShown}
          setScreenShown={setScreenShown}
        ></LobbyAlt>
        : <></>}
      </div>
    </div>
  );
}

export default App;