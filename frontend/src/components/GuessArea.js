import { useState, useEffect } from 'react'
import './GuessArea.css'
import TileMessage from './TileMessage'

const GUESS_LENGTH = 9

function useKey(guess, setGuess) {
    let guessString = guess.join("")
    guessString = guessString.replace(/_/g, "")
    // Bind and unbind events
    useEffect(() => {
        // Does an event match the key we're watching?
        function validLetter(inputLetter) {
            const validLetters = "abcdefghijklmnopqrstuvwxyz".split('')
            for (let i = 0; i < validLetters.length; i++) {
                if (inputLetter == validLetters[i].toLowerCase()) {
                    return true
                }
            }
            return false
        }

        function processStringGuess(stringGuess) {
            if (stringGuess.length > GUESS_LENGTH) {
                stringGuess = stringGuess.substring(0, GUESS_LENGTH)
            }
            while (stringGuess.length < GUESS_LENGTH) {
                stringGuess += "_"
            }
            return stringGuess.split('')
        }
        // Event handlers
        function onDown(event) {
            if (validLetter(event.key.toLowerCase())) {
                let newGuess = guessString + event.key.toUpperCase()
                setGuess(processStringGuess(newGuess))
            }
            else if (event.keyCode == 8) {
                if (guessString != "") {
                    let newGuess = guessString.substring(0, guessString.length - 1)
                    setGuess(processStringGuess(newGuess))
                }
            }
        }
        window.addEventListener("keydown", onDown)
        return () => {
            window.removeEventListener("keydown", onDown)
        }
    }, [guess])

    return
}

function GuessArea(props) {
    let guessInit = []
    for (let i = 0; i < GUESS_LENGTH; i++) { guessInit.push('_') }
    const [guess, setGuess] = useState(guessInit)

    useEffect(() => {
        let guessString = guess.join('')
        guessString = guessString.replace(/_/g, "")
        if (guessString != '') {
            props.socket.emit('word', guessString)
        }
    }, [guess])
    // set event listeners
    useKey(guess, setGuess)
    
    return (
        <div className="guess-area">
            <div className="guess-tiles">
                <TileMessage message={guess.join('')} spacing="large"></TileMessage>
            </div>
            <div className="letter-bank">
                <TileMessage message={props.letters} spacing="large"></TileMessage>
            </div>
        </div>
    )
}

export default GuessArea