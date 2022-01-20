import './IconButtonRow.css'
import LobbyIcon from './LobbyIcon'

function IconButtonRow(props) {
    return (
        <div className="lobby-icons">
            <LobbyIcon
                label="about"
                function={() => props.setScreenShown("about")}
            ></LobbyIcon>
            <LobbyIcon
                label="profile"
                function={() => props.setScreenShown("profile")}
            ></LobbyIcon>
        </div>
    )
}

export default IconButtonRow