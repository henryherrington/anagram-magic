import { useState } from 'react';
import PlayerBox from './PlayerBox';
import './Lobby.css';
import IconButton from './IconButton';
import LobbyTile from './LobbyTile';

function Lobby(props) {
    let players = Object.values(props.lobbyPlayers)
    const [usernameInput, setUsernameInput] = useState('')

    function enqueuePlayer() {
        props.socket.emit('enqueue player')
    }

    function handleUsernameForm(e) {
        if (usernameInput != '') {
            props.socket.emit('username', usernameInput)
            setUsernameInput('')
        }
        e.preventDefault()
    }

    return (
        <div id="lobby"> 
            <div className="player-box-container">
                <PlayerBox
                    avatar="blank"
                    username={props.playerUsername}
                ></PlayerBox>
            </div>
            {/* <form onSubmit={handleUsernameForm}>
                <input
                    value={usernameInput}
                    onInput={e => (setUsernameInput(e.target.value))}
                    autoComplete="off"
                    placeholder="username"
                />
                <button>Set</button>
            </form> */}
            <IconButton
                    function={enqueuePlayer}
                    icon="play"
                    size="lg"
            ></IconButton>
            <div className="lobby-pit">
                {players.map((players) => (
                    <LobbyTile key={players}></LobbyTile>
                ))}
            </div>
        </div>
    )
}

export default Lobby