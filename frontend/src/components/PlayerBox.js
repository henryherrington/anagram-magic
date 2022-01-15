import { useState, useEffect } from 'react';
import './PlayerBox.css';
import TileMessage from './TileMessage';

function PlayerBox(props) {
    const [time, setTime] = useState(100)

    return (
        <div>
            <div className="player-box">
                <div className="player-box-username">{props.username}</div>
                <img className="player-box-img" src={"https://storage.googleapis.com/www.escapeworld.org/avatars/avatar-" + props.avatar + ".png"}></img>
            </div>
            {props.revealWord
            ? <TileMessage message={props.word} size="small"></TileMessage>
            : <></>
            }
        </div>
    )
}

export default PlayerBox