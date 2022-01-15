import { useState } from 'react';
import Timer from './Timer'
import PlayerBox from './PlayerBox';
import LetterTile from './LetterTile';
import GuessArea from './GuessArea';

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
    let playerWord = 0
    let oppWord = 0

    if ("players" in props.roomData && props.roomData["players"].length > 1) {
        let username0 = props.roomData["players"][0]["username"]
        let word0 = props.roomData["players"][0]["word"]
        let username1 = props.roomData["players"][1]["username"]
        let word1 = props.roomData["players"][1]["word"]
        if (props.roomData["players"][0]["id"] == props.socket.id) {
            playerUsername = username0
            playerWord = word0
            oppUsername = username1
            oppWord = word1
        }
        else {
            playerUsername = username1
            playerWord = word1
            oppUsername = username0
            oppWord = word0
        }
    }

    let isRecapRound = (props.roomData["round"] * 2 % 2 != 0)

    return (
        <div id="room">
            {/* <button onClick={forfeitGame}>Forfeit Game</button> */}
            <div className="players-container">
                <div className="player-box-container">
                    <PlayerBox
                        username={playerUsername}
                        avatar="blank"
                        word={playerWord}
                        revealWord={isRecapRound}
                    ></PlayerBox>
                </div>
                <div className="timer-container">
                    {/* <Timer startTime={props.roomTimer}></Timer> */}
                    <Timer startTime={30}></Timer>
                </div>
                <div className="player-box-container">
                    <PlayerBox
                        username={oppUsername}
                        avatar="blank"
                        word={oppWord}
                        revealWord={isRecapRound}
                    ></PlayerBox>
                </div>
            </div>
            {!isRecapRound? 
            <div>
                <form onSubmit={handleWordForm}>
                    <input
                        value={wordInput}
                        onInput={e => (setWordInput(e.target.value))}
                        autoComplete="off"
                        placeholder="word"
                    />
                    <button>Submit</button>
                </form>
                <GuessArea letters={props.roomData.roundLetters}></GuessArea>
            </div>
            : <></>
            }
            <p>Room data: {JSON.stringify(props.roomData)}</p>
        </div>
    )
}

export default Room