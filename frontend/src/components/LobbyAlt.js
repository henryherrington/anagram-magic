import TileMessage from './TileMessage';
import './LobbyAlt.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function LobbyAlt(props) {
    return (
        <div className="lobby-alt">
            <div className="back-button-container">
                <FontAwesomeIcon
                    className="back-button"
                    icon={faTimes}
                    onClick={() => props.setScreenShown("lobby")}
                    size="2x"
                ></FontAwesomeIcon>
            </div>
            <TileMessage message={props.contents} spacing="small"></TileMessage>
        </div>
    )
}

export default LobbyAlt