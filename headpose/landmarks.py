import cv2
import numpy as np
import dlib

dlib_detector = dlib.get_frontal_face_detector()
dlib_predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")

def get_landmarks(image, model):
    if model == "dlib": return get_landmarks_dlib(image)
    return None

def get_landmarks_dlib(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = dlib_detector(image)
    if len(faces) == 0: return None
    
    face = faces[0]
    landmarks = dlib_predictor(image=image, box=face)
    return [(landmarks.part(i).x, landmarks.part(i).y) for i in range(68)]
