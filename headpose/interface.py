import cv2
import numpy as np
import math
import landmarks
import solvepnp
import gaze


def process_frame(image, landmark_model, pnp_flag, gaze_model):
    lms, hp, gz = None, None, None
    rvec, tvec = None, None
    lms = landmarks.get_landmarks(img, landmark_model)
    if lms: 
        hp = solvepnp.get_headpose(img, lms, pnp_flag)
    if hp:
        rvec = [round(x/3.14*180, 1) for x in hp[0]]
        tvec = [round(x, 1) for x in hp[1]]
        gz = gaze.get_gaze(img, hp[0], hp[1], gaze_model)
    return lms, hp, gz, rvec, tvec


def get_gaze(image, landmark_model, pnp_flag, gaze_model):
    return process_frame(image, landmark_model, pnp_flag, gaze_model)[2]


landmark_models = ["dlib"]
pnp_flags = [cv2.SOLVEPNP_ITERATIVE, cv2.SOLVEPNP_EPNP, cv2.SOLVEPNP_DLS]
gaze_models = ["prev"]
landmark_i, pnp_i, gaze_i = 0, 0, 0

lam = 0.1
gz_p = (0, 0)

debug = True
show_point = True

cap = cv2.VideoCapture(0)
while True:
    ret, img = cap.read()
    if not ret: continue

    landmark_model = landmark_models[landmark_i]
    pnp_flag = pnp_flags[pnp_i]
    gaze_model = gaze_models[gaze_i]
    lms, hp, gz, rvec, tvec = process_frame(img, landmark_model, pnp_flag, gaze_model)

    if debug:
        # draw landmarks on face
        if lms:
            for (x, y) in lms:
                cv2.circle(img, (x, y), 2, (0, 0, 255), -1)
        # show models and flags used
        cv2.putText(img, f"landmarks: {landmark_models[landmark_i]}", (25, 25), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))
        cv2.putText(img, f"pnp: {pnp_flags[pnp_i]}", (25, 40), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))
        cv2.putText(img, f"gaze: {gaze_models[gaze_i]}", (25, 55), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))
        # show estimation results
        cv2.putText(img, f"pnp: {rvec}, {tvec}", (25, 85), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255)) 
        cv2.putText(img, f"gaze: {gz}", (25, 100), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))
    if gz:
        gz_p = (int(gz_p[0]*(1-lam) + lam*gz[0]), int(gz_p[1]*(1-lam) + lam*gz[1]))
    if show_point: cv2.circle(img, gz_p, 10, (0, 255, 0), -1)
    
    #img = cv2.resize(img, (1600, 900)) TODO: rescale to fullscreen
    cv2.imshow("window", img)
    
    key = chr(cv2.waitKey(10) & 0xFF)
    if (key == 'e'): exit()
    elif (key == 'd'): debug = not debug
    elif (key == 'p'): show_point = not show_point
    elif (key == 'q'): landmark_i = (landmark_i - 1) % len(landmark_models)
    elif (key == 'w'): landmark_i = (landmark_i + 1) % len(landmark_models)
    elif (key == 'a'): pnp_i = (pnp_i - 1) % len(pnp_flags)
    elif (key == 's'): pnp_i = (pnp_i + 1) % len(pnp_flags)
    elif (key == 'z'): gaze_i = (gaze_i - 1) % len(gaze_models)
    elif (key == 'x'): gaze_i = (gaze_i + 1) % len(gaze_models)
