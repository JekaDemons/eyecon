import React, { useState } from 'react';
import './App.css';


const defaultParticipants = [
    {
        'state': 1
    },
    {
        'state': 0
    },
    {
        'state': -1
    },
    {
        'state': -1
    },
]

function calcAllPoses(participants, gaze) {
    // TODO: get gaze information from head pose
    let numParticipants = participants.length
    let iw = window.innerWidth
    let focused = Math.floor(gaze['x'] / (iw / numParticipants))
    let ret = []

    for (const [i, p] of participants.entries()) {
        // Create a copy of participant
        let ret_p = JSON.parse(JSON.stringify(p))

        // Change state based on gaze focus
        if (i < focused) {
            ret_p['state'] = 1
        }
        else if (i === focused) {
            ret_p['state'] = 0
        }
        else {
            ret_p['state'] = -1
        }

        ret.push(ret_p)
    }

    console.log("gaze:"+JSON.stringify(gaze))
    console.log(ret)
    return ret
}

function App() {
    let gaze = {
        'x': 200,
        'y': 400
    }
    const [participants, setParticipants] = useState(defaultParticipants)
    return (
        <div className="App">
            <div className="participants">
                {participants.map((p, i) => {
                    return (
                        <div key={i} className="participant" style={{"width": (100 / participants.length) + "%"}}>
                            {p.state} 
                        </div>
                    )
                })}
            </div>
            <button className="helper" onClick={ () => {calcAllPoses(participants, gaze)} }>Gaze</button>
        </div>
    );
}

export default App;
