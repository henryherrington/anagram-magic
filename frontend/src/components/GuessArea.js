import { useState, useEffect } from 'react'
import './GuessArea.css'
import TileMessage from './TileMessage'

const GUESS_LENGTH = 9

function useKey(oldGuess, setGuess, availableLetters, setAvailableLetters, originalLetters) {
    oldGuess = oldGuess.replace(/_/g, "")
    
    useEffect(() => {
        function validLetter(inputLetter) {
            if (availableLetters.indexOf(inputLetter.toLowerCase()) < 0) return false
            return true
        }

        function processGuessLength(newGuess) {
            if (newGuess.length > GUESS_LENGTH) {
                newGuess = newGuess.substring(0, GUESS_LENGTH)
            }
            while (newGuess.length < GUESS_LENGTH) {
                newGuess += "_"
            }
            return newGuess
        }
        
        function onDown(event) {
            if (validLetter(event.key)) {
                let newGuess = oldGuess + event.key
                setGuess(processGuessLength(newGuess))
                setAvailableLetters(availableLetters.replace(event.key, "."))
            }
            else if (event.keyCode == 8) {
                if (oldGuess != "") {
                    let deletedLetter = oldGuess.slice(-1)
                    for (let i = 0; i < availableLetters.length; i++) {
                        if (availableLetters[i] == "." && originalLetters[i] == deletedLetter) {
                            let newAvailable = availableLetters.slice(0, i) + deletedLetter + availableLetters.slice(i + 1)
                            setAvailableLetters(newAvailable)
                            break;
                        }
                    }
                    let newGuess = oldGuess.substring(0, oldGuess.length - 1)
                    setGuess(processGuessLength(newGuess))
                }
            }
        }

        window.addEventListener("keydown", onDown)
        return () => {
            window.removeEventListener("keydown", onDown)
        }
    }, [oldGuess, originalLetters, availableLetters])
    return
}

function GuessArea(props) {
    let guessInit = ''
    for (let i = 0; i < GUESS_LENGTH; i++) { guessInit += '_' }
    const [guess, setGuess] = useState(guessInit)
    const [originalLetters, setOriginalLetters] = useState(props.letters)
    const [availableLetters, setAvailableLetters] = useState(props.letters)
    
    useEffect(() => {
        setOriginalLetters(props.letters);
        setAvailableLetters(props.letters)
    }, [props.letters])

    useEffect(() => {
        let guessString = guess.replace(/_/g, "")
        props.socket.emit('word', guessString.toLowerCase())
    }, [guess])

    // set event listeners
    useKey(guess, setGuess, availableLetters, setAvailableLetters, originalLetters)
    
    return (
        <div className="guess-area">
            <div className="guess-tiles">
                <TileMessage message={guess} spacing="large"></TileMessage>
            </div>
            <div className="letter-bank">
                <TileMessage message={availableLetters} spacing="large"></TileMessage>
            </div>
        </div>
    )
}

export default GuessArea