import CircleIconButton from './CircleIconButton';
import './EndGameArea.css';

function EndGameArea(props) {

    function leaveToLobby() {
        console.log("done")
        props.socket.emit('terminate room')
        props.showLobby()
    }

    return (
        <div>
            <p>Game over!</p>
            {props.roomData["winners"].length > 1 ?
                "Tie Game!"
            :
                <p>Winner is {props.roomData["winners"][0]}</p>
            }
            <CircleIconButton icon="exit" function={leaveToLobby}></CircleIconButton>
        </div>
    )
}

export default EndGameArea