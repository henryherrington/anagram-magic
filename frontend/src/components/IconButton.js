import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import './IconButton.css';

function IconButton(props) {

    var displayIcon

    switch (props.icon.toLowerCase()) {
        case 'exit':
            displayIcon = faSignOutAlt;
            break
        default:
            displayIcon = faPlay
    }

    return (
        <div>
            <button 
                className="button"
                onClick={props.function}
            >
            <FontAwesomeIcon icon={displayIcon} size="lg"/>
            </button>
        </div>
    )
}

export default IconButton