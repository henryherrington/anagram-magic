import './LobbyTile.css';

function LobbyTile(props) {
    return (
        <div className="lobby-tile">
            <img className="lobby-tile-avatar" src={"./avatars/avatar-" + props.player["avatar"] + ".png"}></img>
        </div>
    )
}

export default LobbyTile