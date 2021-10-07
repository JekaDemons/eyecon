import * as faceapi from 'face-api.js';

export async function loadModels() {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
}

