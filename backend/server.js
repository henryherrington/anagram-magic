const express = require("express");
const http = require("http");
const path = require('path')

const socketIo = require("socket.io");

const port = process.env.PORT || 4000;

const app = express();


app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


const server = http.createServer(app);

// const io = socketIo(server);

// for development only
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// contains data on usernames, room/game info
var players = {}
var inLobby = {}
var rooms = {}
var inQueue = ""
var roomGen = 0
var userGen = 0
const GAME_TIMER_SECONDS = 10

io.on('connection', (socket) => {
    console.log(socket.id)

    function getOpp() {
        let roomId = players[socket.id]["roomId"]
        for (let i = 0; i < rooms[roomId]["players"].length; i++) {
            let player = rooms[roomId]["players"][i]
            if (player != socket.id) {
                return player["id"]
            }
        }
    }

    function getRoomPlayer(targetPlayerId) {
        let roomId = players[socket.id]["roomId"]
        for (let i = 0; i < rooms[roomId]["players"].length; i++) {
          let currPlayer = rooms[roomId]["players"][i]
          if (currPlayer["id"] == targetPlayerId) {
              return currPlayer
          }
      }
    }

    function lobbySpawn(username) {
        inLobby[socket.id] = username
        players[socket.id] = {}
        players[socket.id]["username"] = username
        io.emit('lobby players', inLobby)
    }

    function initializeRoom(roomId) {
        rooms[roomId] = {
          "players": [],
          "round": 0,
          "roundTimer": GAME_TIMER_SECONDS,
          "roundLetters": "",
          "ended": false,
          "cause": "forfeit",
          "winners": []
        }
    }

    function addPlayerToRoom() {
        let roomId = players[socket.id]["roomId"]
        let roomPlayer = {}
        roomPlayer["id"] = socket.id
        roomPlayer["username"] = players[socket.id]["username"]
        roomPlayer["word"] = ""
        rooms[roomId]["players"].push(roomPlayer)
    }

    function startGame() {
        let roomId = players[socket.id]["roomId"]
        io.to(roomId).emit('in room', roomId, rooms[roomId])
        startRound()
    }

    function startRound() {
        let roomId = players[socket.id]["roomId"]
        rooms[roomId]["roundLetters"] = genLetters(9) 
        io.to(roomId).emit("update game", rooms[roomId])
        setTimeout(() => {
          endGame("timeout")
        }, GAME_TIMER_SECONDS * 1000)
    }

    function genLetters(count) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ""
      for (let i = 0; i < count; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result
    }

    function endGame(cause) {
        let roomId = players[socket.id]["roomId"]
        if (rooms[roomId]["ended"]) return

        let winners = [players[getOpp()]["username"]]

        console.log(cause)
        if (cause == "timeout") {
            console.log("here")
            let roomPlayer = getRoomPlayer(socket.id)
            let roomOpp = getRoomPlayer(getOpp())

            playerWord = roomPlayer["word"]
            oppWord = roomOpp["word"]

            console.log(playerWord)
            console.log(oppWord)

            if (oppWord.length < playerWord.length) {
                winners = [players[socket.id]["username"]]
            }
            else if (oppWord.length == playerWord.length) {
                winners = [players[socket.id]["username"], players[getOpp()]["username"]]
            }
        }

        rooms[roomId]["ended"] = true
        rooms[roomId]["cause"] = cause
        rooms[roomId]["winners"] = winners

        // store win
        console.log(rooms[roomId])
        io.to(players[socket.id]["roomId"]).emit('end game', rooms[roomId])
    }

    function terminateRoom() {
        // destroy room
        let roomId = players[socket.id]["roomId"]
        socket.leave(roomId)
        if (roomId in rooms) delete rooms[roomId]
        delete players[socket.id]["roomId"]

        // rejoin lobby
        inLobby[socket.id] = players[socket.id]["username"]
        io.emit('lobby players', inLobby)
    }

    lobbySpawn("Guest " + userGen++)
    socket.on('username', (username) => { lobbySpawn(username) })

    socket.on('enqueue player', () => {
        if (inQueue == "") {
            inQueue = socket.id;
            let newRoom = roomGen
            players[socket.id]["roomId"] = newRoom // add room to player
            initializeRoom(newRoom)
            addPlayerToRoom()
            socket.join(newRoom)
        }
        else if (inQueue != socket.id){
            partner = inQueue
            inQueue = ""
            delete inLobby[socket.id]
            delete inLobby[partner]
            io.emit('lobby players', inLobby)

            let newRoom = roomGen++
            players[socket.id]["roomId"] = newRoom // add room to player
            addPlayerToRoom()
            socket.join(newRoom)

            startGame()
        }
    })

    socket.on("word", (word) => {
        let roomId = players[socket.id]["roomId"]
        if (roomId == null) return
        let roomPlayer = getRoomPlayer(socket.id)
        roomPlayer["word"] = word
        io.to(players[socket.id]["roomId"]).emit("update game", rooms[roomId])
    })

    socket.on('forfeit game', () => {
        endGame("forfeit")
    })

    socket.on("terminate room", () => {
        terminateRoom()
    })

    socket.on('disconnect', () => {
        let roomId = players[socket.id]["roomId"]
        // if player in game, rely on other user to end game
        if (roomId in rooms) endGame("disconnect")

        delete inLobby[socket.id]
        io.emit('lobby players', inLobby)

        delete players[socket.id]
    })
})

server.listen(4000, () => {
    console.log('listening on *:4000')
});


/*
{
  "players": [
    {
      "id": ---,
      "username": ---,
      "word": ---
    },
    {
      "id": ---,
      "username": ---,
      "word": ---
    }
  ]
  "round": 0,
  "roundLetters": BARKAS,
  "roundTime": 40,
  "ended": true,
  "cause": "forfeit",
  "winners": []
}

*/