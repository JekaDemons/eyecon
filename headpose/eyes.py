import cv2
import numpy as np
import math
import landmarks
import solvepnp
import gaze
import pyautogui


def extract_eyes(img):
    lms = landmarks.get_landmarks(img, "dlib")
    if not lms: return None

    lms = np.array(lms).T
   
    left_eye = lms[:, 36:42]
    right_eye = lms[:, 42:48]
   
    le_c = np.mean(left_eye, axis=1)
    re_c = np.mean(right_eye, axis=1)

    d = re_c - le_c
    dl = np.linalg.norm(d)
    theta = math.asin(d[1]/dl) * 180 / 3.14159
    rot = cv2.getRotationMatrix2D((img.shape[0]/2, img.shape[1]/2), theta, 1)
    
    img = cv2.warpAffine(img, rot, (img.shape[1], img.shape[0]))
    lms = rot@np.vstack([lms, np.ones((1, 68))])
    lms = lms.astype(int)

    lms = lms[:, 36:48]
    mi = np.min(lms, axis=1)
    ma = np.max(lms, axis=1)
    x_1, y_1 = mi[0], mi[1]
    x_2, y_2 = ma[0], ma[1]

    s = int(dl*0.1)
    x_1 -= s
    y_1 -= s//2
    x_2 += s
    y_2 += s//2

    img = img[y_1:y_2, x_1:x_2, :]
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (200, 50))
    return img


def extract_pos():
    return np.array(pyautogui.position()) / np.array(pyautogui.size())


record = False

data = []
labels = []
cap = cv2.VideoCapture(0)
while True:
    ret, img = cap.read()
    if not ret: continue
    
    eyes = extract_eyes(img)
    pos = extract_pos()
    if eyes is None: continue

    if record:
        data.append(eyes)
        labels.append(pos)
        #record = False
        print(len(data))

    cv2.imshow("window", eyes)
    key = chr(cv2.waitKey(30) & 0xFF)
    
    if key == 'q': record = not record
    if key == 'w':
        data = np.array(data)
        labels = np.array(labels)
        with open('data.npy', 'wb') as f:
            np.save(f, data)
            np.save(f, labels)
        print(data.shape)
        print(labels.shape)
        exit()




