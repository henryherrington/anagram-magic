import './PlayerBox.css';
import TileMessage from './TileMessage';
import WordInProgressBox from './WordInProgressBox';

function PlayerBox(props) {

    return (
        <div>
            <div className="player-box">
                <div className="player-box-username">{props.playerData["username"]}</div>
                <img className="player-box-img" src={"./avatars/avatar-" + props.playerData["avatar"] + ".png"}></img>
                {props.showScore ? 
                    <div className="score">
                        <span>Score: {props.playerData["score"]}</span>
                    </div>
                :   <></>
                }
            </div>
            {props.revealWord
            ? <TileMessage message={props.playerData["word"]} size="small"></TileMessage>
            : <WordInProgressBox word={props.playerData["word"]}></WordInProgressBox>
            }
        </div>
    )
}

export default PlayerBox