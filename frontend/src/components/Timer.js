import { useState, useEffect } from 'react';
import './Timer.css';

function Timer(props) {
    const [time, setTime] = useState(props.startTime)

    return (
        <div className="timer">
            <p>Time left: {time}</p>

        </div>
    )
}

export default Timer