// import { useState } from 'react';
import './EndScreen.css';
import IconButton from './IconButton';

function EndScreen(props) {

    function terminateRoom() {
        props.socket.emit('terminate room')
        props.showLobby()
    }

    return (
        <div id="end-screen">
            <h1>End Screen</h1>
            { props.roomData.ended ?
            <div>
                <p>You're done!</p>
                { props.roomData["winners"].length == 1 ?
                <p>{props.roomData["winners"][0]} wins!</p>
                :
                <p>Tie Game!</p>
                }
                <IconButton icon="exit" function={terminateRoom} ></IconButton>
            </div>
            :
            <div>
                <p>Game not ended</p>
            </div>
            }
            
        </div>
    )
}

export default EndScreen