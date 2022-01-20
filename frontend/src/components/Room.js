import Timer from './Timer'
import PlayerBox from './PlayerBox';
import GuessArea from './GuessArea';

import './Room.css';
import EndGameArea from './EndGameArea';

function Room(props) {

    function forfeitGame() {
        props.socket.emit("forfeit game")
    }

    let opp, player

    if ("players" in props.roomData && props.roomData["players"].length > 1) {
        if (props.roomData["players"][0]["id"] == props.socket.id) {
            player = props.roomData["players"][0]
            opp = props.roomData["players"][1]
        }
        else {
            opp = props.roomData["players"][0]
            player = props.roomData["players"][1]
        }
    }

    let isRecapRound = (props.roomData["round"] * 2 % 2 != 0)

    return (
        <div id="room">
            {/* <button onClick={forfeitGame}>Forfeit Game</button> */}
            <div className="players-container">
                <div className="player-box-container">
                    <PlayerBox
                        playerData = {player}
                        revealWord={isRecapRound}
                        showScore={true}
                    ></PlayerBox>
                </div>
                <div className="timer-container">
                    {props.roomData["ended"] ? <></> :
                        <Timer
                            startTime={props.roomData.roundTimer}
                            refresh={props.roomData.round}
                        ></Timer>
                    }
                </div>
                <div className="player-box-container">
                    <PlayerBox
                        playerData = {opp}
                        revealWord={isRecapRound}
                        showScore={true}
                    ></PlayerBox>
                </div>
            </div>
            {!isRecapRound? 
            <div>
                <GuessArea
                    letters={props.roomData.roundLetters}
                    socket={props.socket}
                ></GuessArea>
            </div>
            : (props.roomData["ended"]
                ? <EndGameArea
                    socket={props.socket}
                    roomData={props.roomData}
                    showLobby={() => props.setScreenShown("lobby")}
                ></EndGameArea>
                : <></>
              )
            }
        </div>
    )
}

export default Room