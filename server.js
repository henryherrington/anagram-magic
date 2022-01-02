const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// contains data on usernames, room/game info
var players = {}
var inLobby = {}
var rooms = {}
var inQueue = ""
var roomGen = 0
var userGen = 0



io.on('connection', (socket) => {
    function lobbySpawn(username) {
        inLobby[socket.id] = username
        players[socket.id] = {}
        players[socket.id]["username"] = username
        io.emit('lobby players', inLobby)
    }

    function addPlayerToRoom(room) {
        if (!(room in rooms)) rooms[room] = {}
        rooms[room][socket.id] = {}
        rooms[room][socket.id]["username"] = players[socket.id]["username"]
        rooms[room][socket.id]["word"] = ""
    }

    function endGame() {
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
            addPlayerToRoom(newRoom)
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
            addPlayerToRoom(newRoom)
            socket.join(newRoom)

            io.to(newRoom).emit('in room', newRoom)
        }
    })

    socket.on("word", (word) => {
        let room = players[socket.id]["room"]
        rooms[room][socket.id]["word"] = word
        io.to(players[socket.id]["room"]).emit("update game", rooms[room])
    })

    socket.on('end game signal', () => {
        io.to(players[socket.id]["room"]).emit('end game')
    })

    socket.on("end game", () => {
        endGame()
    })

    socket.on('disconnect', () => {
        let room = players[socket.id]["room"]
        // if player in game, rely on other user to end game
        if (room in rooms) io.to(players[socket.id]["room"]).emit('end game')

        delete inLobby[socket.id]
        io.emit('lobby players', inLobby)

        delete players[socket.id]
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000')
});