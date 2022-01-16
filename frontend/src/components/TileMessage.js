import './TileMessage.css';

import LetterTile from './LetterTile';

function TileMessage(props) {
    let letterTileKeyGen = 0

    return (
        <div className="tile-message">
            {props.message ? 
                props.message.split('').map((letter) =>
                    <LetterTile
                        letter={letter}
                        key={letterTileKeyGen++}
                        spacing={props.spacing}
                        size={props.size}
                        hidden={props.hidden}
                    ></LetterTile>
                )
            : <></>
            }
        </div>
    )
}

export default TileMessage