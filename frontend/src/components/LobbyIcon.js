import './LobbyIcon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'


function LobbyIcon(props) {
    let displayIcon
    if (props.label == "profile") displayIcon = faUser
    else if (props.label == "about") displayIcon = faBook

    return (
        <div className="lobby-icon">
            <FontAwesomeIcon
                className="icon"
                icon={displayIcon}
                // size="md"
                onClick={props.function}
            />
        </div>
    )
}

export default LobbyIcon