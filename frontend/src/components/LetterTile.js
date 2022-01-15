import './LetterTile.css';

function LetterTile(props) {
    let classes
    let content

    if (props.letter ==  " ") {
        classes = "spacer"
        content = ""
    }
    else {
        if (props.letter == "_") {
            classes = "empty-letter-tile"
            content = " "
        }
        else {
            classes = "letter-tile"
            content = props.letter
        }

        if (props.spacing == "large") {
            classes += " spacing-large"
        }
        else {
            classes += " spacing-small"
        }

        if (props.size == "small") {
            classes += " size-small"
        }
        else {
            classes += " size-medium"
        }

    }
        
    return (
        <div className="letter-container">
            <div className={classes}>
                {(content == " ") ? <div>&nbsp;</div> : content}
            </div>
        </div>
    )
}

export default LetterTile