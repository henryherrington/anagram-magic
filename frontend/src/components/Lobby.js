import './Lobby.css';

function Lobby(props) {
    return (
        <div id="lobby">
            <h1>Lobby</h1>
            {Object.entries(props.lobbyPlayers).map((players) => (
                <li key={players}>{players}</li>
            ))}
        </div>
    )
}

export default Lobby