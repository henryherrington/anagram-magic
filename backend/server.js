const express = require("express");
const http = require("http");
const path = require('path')
const socketIo = require("socket.io");
const port = process.env.PORT || 4000;
const app = express();
const allWords = require('./allWords')

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
const ROUND_TIMER_SECONDS = 5
const RECAP_TIMER_SECONDS = 3

io.on('connection', (socket) => {
    console.log("connected: " + socket.id)
    lobbySpawn("Guest " + userGen++, genAvatar())

    function isAnagramOf(inputWord, letterBank) {
        let word = inputWord.toLowerCase()
        let lbCounts = {}
        for (let i=0; i < letterBank.length; i++) {
            if (letterBank[i] in lbCounts) {
                lbCounts[letterBank[i]]++
            }
            else {
                lbCounts[letterBank[i]] = 1
            }
        }
        for (let i=0; i < word.length; i++) {
            if (!(word[i] in lbCounts)) return false
            if (lbCounts[word[i]] <= 0) return false
            lbCounts[word[i]]--
        }
        return true
    }

    function getOpp() {
        let roomId = players[socket.id]["roomId"]
        for (let i = 0; i < rooms[roomId]["players"].length; i++) {
            let player = rooms[roomId]["players"][i]
            if (player["id"] != socket.id) {
                return player["id"]
            }
        }
    }

    function lobbySpawn(username, avatar) {
        players[socket.id] = {
            "id"        : socket.id,
            "username"  : username,
            "avatar"    : avatar,
            "roomId"    : "",
            "word"      : "",
            "score"     : 0
        }
        inLobby[socket.id] = players[socket.id]
        io.emit('lobby players', inLobby)
    }

    function initializeRoom(roomId) {
        rooms[roomId] = {
          "players": [],
          "round": 0,
          "roundTimer": 0,
          "roundLetters": "",
          "ended": false,
          "cause": "forfeit",
          "winners": []
        }
    }

    function addPlayerToRoom() {
        let roomId = players[socket.id]["roomId"]
        rooms[roomId]["players"].push(players[socket.id])
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
        if (!(roomId in rooms)) return false
        let round = rooms[roomId]['round']
        return ((round * 2) % 2 != 0)
    }
    
    function startRound() {
        // if starting player disconnected (and therefore game has ended already), return
        if (!(socket.id in players)) return
        let roomId = players[socket.id]["roomId"]
        if (!(roomId in rooms)) return

        let oldRound = rooms[roomId]["round"]
        
        // update round, letters, player words, (and score)
        let round
        let roundTime
        if (oldRound == 0) round = 1
        else round = oldRound + .5
        rooms[roomId]["round"] = round
       
        let isRecap = isInRecapRound()

        let playerRoomData, oppRoomData
        if (!isRecap) {
            roundTime = ROUND_TIMER_SECONDS
            rooms[roomId]["roundTimer"] = roundTime
            rooms[roomId]["roundLetters"] = genLetters(9)
            rooms[roomId]["players"][0]["word"] = ""
            rooms[roomId]["players"][1]["word"] = ""

            playerRoomData = getCensoredRoomData(getOpp())
            oppRoomData = getCensoredRoomData(socket.id)

            console.log("starting round: " + round)
        }
        else {
            roundTime = RECAP_TIMER_SECONDS
            rooms[roomId]["roundTimer"] = roundTime

            // calculate score
            for (let i = 0; i < rooms[roomId]['players'].length; i++) {
                let word = rooms[roomId]['players'][i]['word']
                if (allWords["isInWordList"](word)) {
                    rooms[roomId]['players'][i]['score'] += word.length
                }
            }
            
            
            playerRoomData = rooms[roomId]
            oppRoomData = rooms[roomId]
            console.log("starting recap round: " + round)
        }

        if (round == 5.5) endGame("timeout")

        io.to(socket.id).emit("update game", playerRoomData)
        io.to(getOpp()).emit("update game", oppRoomData)

        if (!rooms[roomId]["ended"]) {
            setTimeout(() => {
                startRound("timeout")
              }, roundTime * 1000)
        }
    }

    function genLetters(count) {
        let allConstonants = allWords.allConstonants
        let allVowels = allWords.allVowels
        let allLetters = allConstonants.concat(allVowels)
        let vowelCount = Math.floor(count / 3)
        let constCount = Math.floor(count / 3)
        let randCount = count - vowelCount - constCount

        let result = ""
        for (let i = 0; i < constCount; i++) {
            result += allConstonants[Math.floor(Math.random() * allConstonants.length)];
        }
        for (let i = 0; i < vowelCount; i++) {
            result += allVowels[Math.floor(Math.random() * allVowels.length)];
        }
        for (let i = 0; i < randCount; i++) {
            result += allLetters[Math.floor(Math.random() * allLetters.length)];
        }
        return result
    }

    function genAvatar() {
        const AVATARS = ['bee', 'blank', 'flower', 'pawn', 'skull', 'worm']
        return AVATARS[Math.floor(Math.random() * AVATARS.length)];
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
            playerScore = players[socket.id]["score"]
            oppScore = players[getOpp()]["score"]

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
    }

    function terminateRoom() {
        // destroy room
        let roomId = players[socket.id]["roomId"]
        socket.leave(roomId)
        if (roomId in rooms) delete rooms[roomId]
        players[socket.id]["roomId"] = ""
        players[socket.id]["word"] = ""

        // rejoin lobby
        inLobby[socket.id] = players[socket.id]
        io.emit('lobby players', inLobby)
    }

    socket.on('username', (username) => { lobbySpawn(username, "worm") })

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
        let roomId = players[socket.id]['roomId']
        if (roomId == null) return
        if (!(roomId in rooms)) return
        if (isInRecapRound()) return
        if (!(isAnagramOf(word, rooms[roomId]['roundLetters']))) return

        players[socket.id]['word'] = word
        io.to(socket.id).emit('update game', getCensoredRoomData(getOpp()))
        io.to(getOpp()).emit('update game', getCensoredRoomData(socket.id))
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
  'VilSGeYPiA3fg2-FAAAD': {
        id: ___,
        username: ___,
        avatar: ___,
        word: ___,
        score: ___,
    },
  'iA7s-iQDB9G18MGZAAAF': {
        id: ___,
        username: ___,
        avatar: ___
    },
}
=====================
==== room object ====
{
  "players": *list of player objects*
  "round": 0,
  "roundLetters": BARKAS,
  "roundTime": 40,
  "ended": true,
  "cause": "forfeit",
  "winners": []
}
=====================
===== in lobby (objects taken from players) ======

*list of player objects*

=====================
*/
