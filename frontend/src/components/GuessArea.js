import { useState } from 'react'
import './GuessArea.css'
import TileMessage from './TileMessage'


function GuessArea(props) {
    const GUESS_LENGTH = 9
    let guessInit = []
    for (let i = 0; i < GUESS_LENGTH; i++) { guessInit.push('_') }

    const [guess, setGuess] = useState(guessInit)
    
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