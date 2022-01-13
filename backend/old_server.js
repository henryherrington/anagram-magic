const express = require('express');
const app = express();
const path = require('path')

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// contains data on usernames, room/game info
var players = {}
var inLobby = {}
var rooms = {}
var inQueue = ""
var roomGen = 0
var userGen = 0
const GAME_TIMER_SECONDS = 15

io.on('connection', (socket) => {
    console.log(socket.id)

    function getOpp() {
        let room = players[socket.id]["room"]
        for (let i = 0; i < rooms[room]["players"].length; i++) {
            let player = rooms[room]["players"][i]
            if (player != socket.id) {
                return player
            }
        }
    }

    function lobbySpawn(username) {
        inLobby[socket.id] = username
        players[socket.id] = {}
        players[socket.id]["username"] = username
        io.emit('lobby players', inLobby)
    }

    function initializeRoom(room) {
        rooms[room] = {}
        rooms[room]["players"] = []
    }

    function addPlayerToRoom() {
        let room = players[socket.id]["room"]
        rooms[room][socket.id] = {}
        rooms[room][socket.id]["username"] = players[socket.id]["username"]
        rooms[room][socket.id]["word"] = ""
        rooms[room]["players"].push(socket.id)
    }

    function startGame() {
        let room = players[socket.id]["room"]
        io.to(room).emit('in room', room, rooms[room], GAME_TIMER_SECONDS)
        io.to(room).emit("update game", rooms[room])
        setTimeout(() => { endGame("timeout")}, GAME_TIMER_SECONDS * 1000)
    }

    function endGame(cause) {
        let room = players[socket.id]["room"]
        if ("ended" in rooms[room]) return
        let winners = [players[getOpp()]["username"]]
        if (cause == "timeout") {
            playerWord = rooms[room][socket.id]["word"]
            oppWord = rooms[room][getOpp()]["word"]
            if (oppWord.length < playerWord.length) {
                winners = [players[socket.id]["username"]]
            }
            else if (oppWord.length == playerWord.length) {
                winners = [players[socket.id]["username"], players[getOpp()]["username"]]
            }
        }
        rooms[room]["ended"] = true
        rooms[room]["cause"] = cause
        rooms[room]["winners"] = winners

        // store win
        io.to(players[socket.id]["room"]).emit('end game', rooms[room])
    }

    function terminateRoom() {
        // destroy room
        let room = players[socket.id]["room"]
        socket.leave(room)
        if (room in rooms) delete rooms[room]
        delete players[socket.id]["room"]

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
            players[socket.id]["room"] = newRoom // add room to player
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
            players[socket.id]["room"] = newRoom // add room to player
            addPlayerToRoom()
            socket.join(newRoom)

            startGame()
        }
    })

    socket.on("word", (word) => {
        let room = players[socket.id]["room"]
        rooms[room][socket.id]["word"] = word
        io.to(players[socket.id]["room"]).emit("update game", rooms[room])
    })

    socket.on('forfeit game', () => {
        endGame("forfeit")
    })

    socket.on("terminate room", () => {
        terminateRoom()
    })

    socket.on('disconnect', () => {
        let room = players[socket.id]["room"]
        // if player in game, rely on other user to end game
        if (room in rooms) endGame("disconnect")

        delete inLobby[socket.id]
        io.emit('lobby players', inLobby)

        delete players[socket.id]
    })
})

server.listen(4000, () => {
    console.log('listening on *:4000')
});