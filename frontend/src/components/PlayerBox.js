import { useState, useEffect } from 'react';
import './PlayerBox.css';

function PlayerBox(props) {
    const [time, setTime] = useState(100)

    return (
        <div className="player-box">
            <div className="player-box-username">{props.username}</div>
            <img className="player-box-img" src={"https://storage.googleapis.com/www.escapeworld.org/avatars/avatar-" + props.avatar + ".png"}></img>
        </div>
    )
}

export default PlayerBox