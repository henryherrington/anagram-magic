import './LetterTile.css';

function LetterTile(props) {
    let classes
    let content

    // set content

    if (props.letter ==  " " || props.letter == ".") {
        content = ""
    }
    else if (props.letter == "_" || props.hidden) {
        content = " "
    }
    else {
        content = props.letter.toUpperCase()
    }
        

    // set classes

    if (props.letter ==  " ") {
        classes = "spacer"
    }
    else if (props.letter ==  ".") {
        classes = "gone"
    }
    else {
        // content classes
        if (props.letter == "_") {
            classes = "empty-letter-tile"
        }
        else {
            classes = "letter-tile"
        }

        // spacing classes
        if (props.spacing == "large") {
            classes += " spacing-large"
        }
        else {
            classes += " spacing-small"
        }

        // size classes
        if (props.size == "extra-small" || props.hidden) {
            classes += " size-extra-small"
        }
        else if (props.size == "small") {
            classes += " size-small"
        }
        else {
            classes += " size-medium"
        }

        // other
        if (props.hidden) classes += " hidden"
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