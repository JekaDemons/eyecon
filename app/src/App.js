import React, { useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Webcam from "react-webcam";
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8080', 'echo-protocol')

client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            console.log('sent number', number);
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
};

function onUserMedia(e) {
    console.log(e)
}

const defaultParticipants = [
    {
        'name': 'kevin',
        'state': 1
    },
    {
        'name': 'cathy',
        'state': 0
    },
    {
        'name': 'amitub',
        'state': -1
    },
    {
        'name': 'ido',
        'state': -1
    },
]

function onClick(e, participants, setParticipants, setPointer) {
    let gaze = {
        "x": e.clientX,
        "y": e.clientY
    }
    setPointer({...gaze})
    return calcAllPoses(participants, gaze, setParticipants)
}

const directions = {
    '-1': 'left',
    '0': 'front',
    '1': 'right'
}

function calcAllPoses(participants, gaze, setParticipants) {
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
    setParticipants(ret)
    return ret
}

function App() {
    console.log(faceapi)
    const [participants, setParticipants] = useState(defaultParticipants)
    const [pointer, setPointer] = useState({"x": 0, "y": 0})
    return (
        <div className="App">
            <div className="participants">
                {participants.map((p, i) => {
                    let bgName = "/img/" + p.name + "-" + directions[p.state.toString()] + ".jpg"
                    return (
                        <div key={i} 
                        className="participant" 
                        style={{
                            width: (100 / participants.length) + "%",
                            backgroundImage: `url(${process.env.PUBLIC_URL + bgName})`
                        }} />
                    )
                })}
            </div>
            <div className="click-area" onClick={ (e) => {onClick(e, participants, setParticipants, setPointer)}}>
                <div id="pointer" style={{"left": pointer.x + "px", "top": pointer.y + "px"}}/>
            </div>
        </div>
    );
}

export default App;
