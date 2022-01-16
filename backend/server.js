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
const GAME_TIMER_SECONDS = 5

io.on('connection', (socket) => {
    console.log("connected: " + socket.id)

    function getOpp() {
        let roomId = players[socket.id]["roomId"]
        for (let i = 0; i < rooms[roomId]["players"].length; i++) {
            let player = rooms[roomId]["players"][i]
            if (player["id"] != socket.id) {
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
        roomPlayer["score"] = 0
        rooms[roomId]["players"].push(roomPlayer)
    }

    function startGame() {
        let roomId = players[socket.id]['roomId']
        rooms[roomId]['players'][0]['score'] = 0
        rooms[roomId]['players'][1]['score'] = 0
        io.to(roomId).emit('in room', roomId, rooms[roomId])
        startRound()
    }

    function isInRecapRound() {
        let roomId = players[socket.id]['roomId']
        let round = rooms[roomId]['round']
        return ((round * 2) % 2 != 0)
    }
    
    function startRound() {
        // if starting player disconnected (and therefore game has ended already), return
        if (!(socket.id in players)) return

        let roomId = players[socket.id]["roomId"]
        let oldRound = rooms[roomId]["round"]
        
        // update round, letters, player words, (and score)
        let round
        if (oldRound == 0) round = 1
        else round = oldRound + .5
        rooms[roomId]["round"] = round
       
        let isRecap = isInRecapRound()

        let playerRoomData, oppRoomData
        if (!isRecap) {
            
            rooms[roomId]["roundLetters"] = genLetters(9)
            rooms[roomId]["players"][0]["word"] = ""
            rooms[roomId]["players"][1]["word"] = ""

            playerRoomData = getCensoredRoomData(getOpp())
            oppRoomData = getCensoredRoomData(socket.id)

            console.log("starting round: " + round)
        }
        else {

            rooms[roomId]['players'][0]['score'] += rooms[roomId]['players'][0]['word'].length
            rooms[roomId]['players'][1]['score'] += rooms[roomId]['players'][1]['word'].length
            playerRoomData = rooms[roomId]
            oppRoomData = rooms[roomId]
            console.log("starting recap round: " + round)
        }

        if (round == 5.5) {
            endGame("timeout")
            return
        }

        io.to(socket.id).emit("update game", playerRoomData)
        io.to(getOpp()).emit("update game", oppRoomData)

        
        setTimeout(() => {
          startRound("timeout")
        }, GAME_TIMER_SECONDS * 1000)
    }

    function genLetters(count) {
        const CONSTONANTS = 'BCDFGHJKLMNPQRSTVWXYZ'
        const VOWELS = 'AEIOU'
        const ALPHABET = CONSTONANTS + VOWELS
        let vowelCount = Math.floor(count / 3)
        let constCount = Math.floor(count / 3)
        let randCount = count - vowelCount - constCount

        let result = ""
        for (let i = 0; i < constCount; i++) {
            result += CONSTONANTS.charAt(Math.floor(Math.random() * CONSTONANTS.length));
        }
        for (let i = 0; i < vowelCount; i++) {
            result += VOWELS.charAt(Math.floor(Math.random() * VOWELS.length));
        }
        for (let i = 0; i < randCount; i++) {
            result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
        }
        return result
    }

    function getCensoredRoomData(censoredPlayer) {
        let roomId = players[censoredPlayer]["roomId"]
        let roomData = rooms[roomId]
        let clonedRoomData = JSON.parse(JSON.stringify(roomData))
        
        for (let i = 0; i < clonedRoomData["players"].length; i++) {
            if (clonedRoomData["players"][i]["id"] == censoredPlayer) {
                let wordLen = clonedRoomData["players"][i]["word"].length
                clonedRoomData["players"][i]["word"] = new Array(wordLen + 1).join("*")
            }
        }
        return clonedRoomData
    }

    function endGame(cause) {
        let roomId = players[socket.id]["roomId"]
        if (rooms[roomId]["ended"]) return

        let winners = [players[getOpp()]["username"]]

        if (cause == "timeout") {
            let roomPlayer = getRoomPlayer(socket.id)
            let roomOpp = getRoomPlayer(getOpp())

            playerScore = roomPlayer["score"]
            oppScore = roomOpp["score"]

            if (oppScore < playerScore) {
                winners = [players[socket.id]["username"]]
            }
            else if (oppScore == playerScore) {
                winners = [players[socket.id]["username"], players[getOpp()]["username"]]
            }
        }

        rooms[roomId]["ended"] = true
        rooms[roomId]["cause"] = cause
        rooms[roomId]["winners"] = winners

        // store win
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

    socket.on('word', (word) => {
        let roomId = players[socket.id]["roomId"]
        if (roomId == null) return

        if (isInRecapRound()) return

        let roomPlayer = getRoomPlayer(socket.id)
        roomPlayer['word'] = word
        io.to(socket.id).emit("update game", getCensoredRoomData(getOpp()))
        io.to(getOpp()).emit("update game", getCensoredRoomData(socket.id))
    })

    socket.on('forfeit game', () => {
        endGame("forfeit")
    })

    socket.on("terminate room", () => {
        terminateRoom()
    })

    socket.on('disconnect', () => {
        console.log("disconnected: " + socket.id)

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

=== players object ==
{
  'VilSGeYPiA3fg2-FAAAD': { username: 'Guest 1' },
  'iA7s-iQDB9G18MGZAAAF': { username: 'Guest 2' }
}
=====================
==== room object ====
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
=====================
*/
