import React, { useState, useEffect, useRef } from "react";
import './Timer.css';



function Timer(props) {
    const [count, setCount] = useState(props.startTime);

    return (
        <div className="timer">
            <p>Time left: {count}</p>
        </div>
    )
}

export default Timer
