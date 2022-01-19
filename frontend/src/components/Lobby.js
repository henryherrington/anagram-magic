import { useState } from 'react';
import PlayerBox from './PlayerBox';
import './Lobby.css';
import IconButton from './IconButton';
import LobbyTile from './LobbyTile';

function Lobby(props) {
    let lobbyPlayers = Object.values(props.lobbyPlayers)
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
                    playerData={props.playerData}
                    showScore={false}
                    revealWord={true}
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
                {lobbyPlayers.map((lobbyPlayer) => (
                    <LobbyTile
                        key={lobbyPlayer["id"]}
                        player={lobbyPlayer}
                    ></LobbyTile>
                ))}
            </div>
        </div>
    )
}

export default Lobby