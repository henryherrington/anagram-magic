import IconButton from './IconButton';
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
            {props.roomData["winners"][0].length > 1 ?
                "Tie Game!"
            :
                <p>Winner is {props.roomData["winners"][0]}</p>
            }
            <IconButton icon="exit" function={leaveToLobby} ></IconButton>
        </div>
    )
}

export default EndGameArea