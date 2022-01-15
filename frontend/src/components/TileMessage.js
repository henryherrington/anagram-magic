import './TileMessage.css';

import LetterTile from './LetterTile';

function TileMessage(props) {
    let letterTileKeyGen = 0

    return (
        <div>
            {props.message ? 
                props.message.split('').map((letter) =>
                    <LetterTile
                        letter={letter}
                        key={letterTileKeyGen++}
                        spacing={props.spacing}
                        size={props.size}
                    ></LetterTile>
                )
            : <></>
            }
        </div>
    )
}

export default TileMessage