import React, { useState, useEffect, useRef } from "react";
import './Timer.css';



function Timer(props) {
    const [count, setCount] = useState(props.startTime)

    React.useEffect(() => {
        if (count > 0) {
            const interval = setTimeout(() => {
                setCount(count - 1)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [count]);

    // in the case that start times do not change between rounds,
    // this component also takes in a "refresh" value that, if changed,
    // will reset the timer
    React.useEffect(() => {
        setCount(props.startTime)
    }, [props.startTime, props.refresh]);

    return (
        <div className="timer">
            <p>Time left: <span id="timer-span">{count}</span></p>
        </div>
    )
}

export default Timer
