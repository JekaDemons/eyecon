const ANGLE_RANGE = [-80, 110] //[-60, 60]
const INVERT_ANGLE = false // true

function normalizeAngle(angle) {
    if (INVERT_ANGLE) { angle = -angle; }
    let res = Math.min(angle, ANGLE_RANGE[1])
    res = Math.max(angle, ANGLE_RANGE[0])
    return 0.5 + res / (ANGLE_RANGE[1] - ANGLE_RANGE[0])
}
function getParticipant(angle, pCount) {
    return parseInt(normalizeAngle(angle)*pCount) 
}

async function update() {
    let video = document.getElementById("videoInput");
    let angles = await getAngles(video);
    if (!angles) return;
    let angle = angles[2];
    
    let participants = await document.getElementById("participants").querySelectorAll(".participant")
    let pIndex = getParticipant(angle, participants.length);

    function point(i, direction) {
        inner = participants[i].querySelectorAll(".participant_inner")
        for(let j = 0; j < 3; j++) { inner[j].style.display = "none" }
        inner[direction].style.display="block"
    }

    point(pIndex, 1)
    for (let i = 0; i < pIndex; i++) point(i, 2);
    for (let i = pIndex+1; i < participants.length; i++) point(i, 0);
}

initialize(document.getElementById("videoInput")).then(() => {
    //console.log("initialized!")
    setInterval(() => (update()), 200)
})
