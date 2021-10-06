async function initialize() {
  await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
}
initialize();

const size = { width: 640, height: 480 };
const focalLength = size.width;
const center = [size.width / 2, size.height / 2];
const cameraMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
  focalLength,
  0,
  center[0],
  0,
  focalLength,
  center[1],
  0,
  0,
  1
]);

var video;
var src, dst, cap;
video = document.getElementById("videoInput"); // video is the id of video tag
video.width = size.width;
video.height = size.height;
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
    src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    cap = new cv.VideoCapture(video);
  });

const numRows = 6;
const imagePoints = cv.Mat.zeros(numRows, 2, cv.CV_64FC1);
const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64FC1); // Assuming no lens distortion
const rvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
const tvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
const pointZ = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 0.0, 500.0]);
const pointY = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 500.0, 0.0]);
const pointX = cv.matFromArray(1, 3, cv.CV_64FC1, [500.0, 0.0, 0.0]);
const noseEndPoint2DZ = new cv.Mat();
const nose_end_point2DY = new cv.Mat();
const nose_end_point2DX = new cv.Mat();
const jaco = new cv.Mat();

var res, landmarks;
var le = [100, 100];
async function captureLandmarks(video) {
  res = await faceapi.detectSingleFace(video).withFaceLandmarks();

  let nose = res.landmarks.getNose().map((a) => [a.x, a.y]);
  let left_eye = res.landmarks.getLeftEye().map((a) => ([a.x, a.y]));
  let right_eye = res.landmarks.getRightEye().map((a) => ([a.x, a.y]));
  let mouth = res.landmarks.getMouth().map((a) => ([a.x, a.y]));
  let jaw = res.landmarks.getJawOutline().map((a) => ([a.x, a.y]));
  landmarks = [
    nose[3], // nose tip
    //nose[3], // nose tip
    left_eye[0], // left eye corner
    right_eye[3], // right eye corner
    mouth[0], // left mouth corner
    mouth[6], // right mouth corner
    jaw[8], // chin
  ];

  return landmarks
}

async function drawLandmarks(landmarks) {
  await cap.read(src)
  for (i = 0; i < landmarks.length; i++) {
    cv.circle(src, new cv.Point(landmarks[i][0], landmarks[i][1]), 2, [255/le.length*i, 0, 0, 255], 3)
  }
  cv.imshow("canvasOutput", src);
}



var model;
async function getAngle(landmarks) {
  model = [
    [0, 0, 0], // nose tip
    //[0, 0, 0], // nose tip
    [-225, 170, -135], // left eye corner
    [225, 170, -135], // right eye corner
    [-150.0, -150.0, -125.0], // left mouth corner
    [150.0, -150.0, -125.0], // right mouth corner
    [0.0, -330.0, -65.0], // chin
  ];

  let le = landmarks[2]
  // Hack! initialize transition and rotation matrixes to improve estimation
  tvec.data64F[0] = -100;
  tvec.data64F[1] = 100;
  tvec.data64F[2] = 1000;
  const distToLeftEyeX = Math.abs(landmarks[2][0] - landmarks[1][0]);
  const distToRightEyeX = Math.abs(landmarks[3][0]-landmarks[1][0]);
  if (distToLeftEyeX < distToRightEyeX) {
    // looking at left
    rvec.data64F[0] = -1.0;
      vec.data64F[1] = -0.75;
      vec.data64F[2] = -3.0;
  } else {
    // looking at right
    rvec.data64F[0] = 1.0;
    rvec.data64F[1] = -0.75;
    rvec.data64F[2] = -3.0;
  }

  landmarks = cv.matFromArray(numRows, 2, cv.CV_64FC1, [].concat(...landmarks));
  model = cv.matFromArray(numRows, 3, cv.CV_64FC1, [].concat(...model));

  const success = cv.solvePnP(
    model,
    landmarks,
    cameraMatrix,
    distCoeffs,
    rvec,
    tvec,
    true
  );
  if (!success) return null;
  return [rvec.data64F[0]*180/Math.PI, rvec.data64F[1]*180/Math.PI, rvec.data64F[2]*180/Math.PI];
}

async function getQuarter(landmarks) {
  let angle = await getAngle(landmarks);
  if (angle > 30) return 0;
  if (angle > 0) return 1;
  if (angle > -30) return 2;
  return 3;
}

async function work() {
  await captureLandmarks(video);
  await drawLandmarks(landmarks);
  console.log(await getAngle(landmarks));
}

setInterval(() => {work()}, 300);