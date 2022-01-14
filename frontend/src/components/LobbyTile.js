import { useState } from 'react';
import './LobbyTile.css';

function LobbyTile(props) {
    return (
        <div className="lobby-tile">
            <img className="lobby-tile-avatar" src={"https://storage.googleapis.com/www.escapeworld.org/avatars/avatar-blank.png"}></img>
        </div>
    )
}

export default LobbyTile