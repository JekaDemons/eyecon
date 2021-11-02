import cv2
import numpy as np
import math
import landmarks
import solvepnp


landmark_models = ["lm1", "lm2", "lm3"]
pnp_flags = ["pnp1", "pnp2", "pnp3"]
landmark_i, pnp_i = 0, 0

debug = True
show_point = True

cap = cv2.VideoCapture(0)
while True:
    ret, img = cap.read()
    if not ret: continue
    
    lms = landmarks.get_landmarks(img, landmark_models[landmark_i])
    hp = solvepnp.get_headpose(landmarks, pnp_flags[pnp_i])
    
    if debug:
        # draw landmarks on face
        # show output of get_headpose
        
        # show models and flags used
        cv2.putText(img, f"landmarks: {landmark_models[landmark_i]}", (25, 25), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))
        cv2.putText(img, f"pnp: {pnp_flags[pnp_i]}", (25, 40), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255))

    if show_point:
        # calculate pixel position of gaze and show on screen
        pass

    cv2.imshow("window", img)
    key = chr(cv2.waitKey(10) & 0xFF)
    if (key == 'e'): exit()
    elif (key == 'd'): debug = not debug
    elif (key == 'p'): show_point = not show_point
    elif (key == 'q'): landmark_i = (landmark_i - 1) % len(landmark_models)
    elif (key == 'w'): landmark_i = (landmark_i + 1) % len(landmark_models)
    elif (key == 'Q'): pnp_i = (pnp_i - 1) % len(pnp_flags)
    elif (key == 'W'): pnp_i = (pnp_i + 1) % len(pnp_flags)
