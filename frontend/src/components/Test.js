import { useState, useEffect } from 'react'
import Timer from './Timer'
import './Test.css'

function Test(props) {
    const [time, setTime] = useState(10)

    return (
        <div className="test">
            <p>test time: {time}</p>
            <input
                value={time}
                onInput={e => (setTime(e.target.value))}
                autoComplete="off"
            >
            </input>
            <Timer startTime={time}></Timer>
        </div>
    )
}

export default Test