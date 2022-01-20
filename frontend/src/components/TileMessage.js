import './TileMessage.css';

import LetterTile from './LetterTile';

function TileMessage(props) {
    let letterTileKeyGen = 0
    let wordKeyGen = 0

    return (
        <div className="tile-message">
            {props.message ? 
                props.message.split(' ').map((word) =>
                    <div className="tile-word" key={wordKeyGen++}>
                        {word.split('').map((letter) => 
                            <LetterTile
                                letter={letter}
                                key={letterTileKeyGen++}
                                spacing={props.spacing}
                                size={props.size}
                                hidden={props.hidden}
                            ></LetterTile>
                        )}
                    </div>
                )
            : <></>
            }
        </div>
    )
}

export default TileMessage