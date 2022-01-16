import './WordInProgressBox.css';
import TileMessage from './TileMessage'

function WordInProgressBox(props) {
    return (
        <div className="WIPB-container">
            {props.word ? 
                <div>
                    <div className="arrow-up"></div>
                    <div className="word-in-progress-box">
                            <TileMessage
                                message={props.word}
                                spacing="small"
                                size="small"
                                hidden={true}
                            ></TileMessage>
                    </div>
                </div>
            :
                <div className="spacer"></div>
            }
        </div>
    )
}

export default WordInProgressBox