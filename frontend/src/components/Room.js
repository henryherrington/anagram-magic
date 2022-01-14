import { useState } from 'react';
import Timer from './Timer'
import PlayerBox from './PlayerBox';
import LetterTile from './LetterTile';

import './Room.css';

function Room(props) {
    const [wordInput, setWordInput] = useState('')

    function handleWordForm(e) {
        if (wordInput != '') {
            props.socket.emit('word', wordInput)
            setWordInput('')
        }
        e.preventDefault()
    }

    function forfeitGame() {
        props.socket.emit("forfeit game")
    }

    let playerUsername = "You"
    let oppUsername = "Opponent"
    let playerWordLength = 0
    let oppWordLength = 0

    if ("players" in props.roomData && props.roomData["players"].length > 1) {
        console.log(props.roomData)
        let username0 = props.roomData["players"][0]["username"]
        let username1 = props.roomData["players"][1]["username"]
        if (props.roomData["players"][0]["id"] == props.socket.id) {
            console.log("t1")
            playerUsername = username0
            oppUsername = username1
        }
        else {
            console.log("t2")
            playerUsername = username1
            oppUsername = username0
        }
    }

    let letterTileKeyGen = 0

    return (
        <div id="room">
            {/* <button onClick={forfeitGame}>Forfeit Game</button> */}
            <div className="players-container">
                <PlayerBox
                    username={playerUsername}
                    avatar="blank"
                    wordLength={playerWordLength}
                ></PlayerBox>
                {/* <Timer startTime={props.roomTimer}></Timer> */}
                <Timer startTime={30}></Timer>
                <PlayerBox
                    username={oppUsername}
                    avatar="blank"
                    wordLength={oppWordLength}
                ></PlayerBox>
            </div>
            <div className="letters-container">
                { props.roomData.roundLetters ?
                props.roomData.roundLetters.split('').map((letter) =>
                    <LetterTile letter={letter} key={letterTileKeyGen++}></LetterTile>
                )
                : <></>}
            </div>
            <form onSubmit={handleWordForm}>
                <input
                    value={wordInput}
                    onInput={e => (setWordInput(e.target.value))}
                    autoComplete="off"
                    placeholder="word"
                />
                <button>Submit</button>
            </form>
            <p>Room data: {JSON.stringify(props.roomData)}</p>
        </div>
    )
}

export default Room