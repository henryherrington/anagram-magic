import { useState } from 'react';
import './PlayerBox.css';
import TileMessage from './TileMessage';
import WordInProgressBox from './WordInProgressBox';

function PlayerBox(props) {
    const [time, setTime] = useState(100)

    

    return (
        <div>
            <div className="player-box">
                <div className="player-box-username">{props.username}</div>
                <img className="player-box-img" src={"https://storage.googleapis.com/www.escapeworld.org/avatars/avatar-" + props.avatar + ".png"}></img>
                {props.showScore ? 
                    <div className="score">
                        <span>Score: {props.score}</span>
                    </div>
                :   <></>
                }
            </div>
            {props.revealWord
            ? <TileMessage message={props.word} size="small"></TileMessage>
            : <WordInProgressBox word={props.word}></WordInProgressBox>
            }
        </div>
    )
}

export default PlayerBox