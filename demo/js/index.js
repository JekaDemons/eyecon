const ANGLE_RANGE = [-60, 60]
function normalizeAngle(angle) {
    angle = -angle; // webcam flips horizontally
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
    
    let participants = document.getElementById("participants").querySelectorAll(".participant")
    let pIndex = getParticipant(angle, participants.length);

    function point(i, direction) {
        participants[i].style.backgroundImage = 'url(\'img/'+i+'-'+direction+'.jpg\')';
    }

    point(pIndex, "front")
    for (let i = 0; i < pIndex; i++) point(i, "right");
    for (let i = pIndex+1; i < participants.length; i++) point(i, "left");
}

initialize(document.getElementById("videoInput")).then(() => {
    //console.log("initialized!")
    setInterval(() => (update()), 200)
})
