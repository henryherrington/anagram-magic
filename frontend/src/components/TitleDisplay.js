import './TitleDisplay.css';
import LetterTile from './LetterTile';

function TitleDisplay(props) {
    const title = "ANAGRAM MAGIC"
    let letterTileKeyGen = 0

    return (
        <div className="title-display">
            <div className="title">
                {title.split('').map((letter) =>
                    <LetterTile letter={letter} key={letterTileKeyGen++}></LetterTile>
                )}
            </div>
        </div>
    )
}

export default TitleDisplay