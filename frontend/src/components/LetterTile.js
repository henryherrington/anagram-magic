import { useState } from 'react';
import './LetterTile.css';

function LetterTile(props) {
    return (
        <div className="letters-container">
            {(props.letter == " ") ?
            <div className="spacer"></div>
            :
                <div className="letter-tile">
                    {props.letter}
                </div>
            }
        </div>
    )
}

export default LetterTile