import './TitleDisplay.css';
import TileMessage from './TileMessage'

function TitleDisplay(props) {
    const title = "ANAGRAM MAGIC"

    return (
        <div className="title-display">
            <div className="title">
                <TileMessage message={title} spacing="small"></TileMessage>
            </div>
        </div>
    )
}

export default TitleDisplay