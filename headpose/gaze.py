import cv2
import numpy as np

def get_gaze(image, rvec, tvec, model):
    if model == "prev": return get_gaze_prev(image, rvec, tvec)
    return None

def get_gaze_prev(image, rvec, tvec):
    angle_x = rvec[2] / 3.14 * 180
    angle_x_range = [-55, 55]
    angle_x_mid = (angle_x_range[0] + angle_x_range[1]) / 2

    angle_y = rvec[0] / 3.14 * 180
    angle_y_range = [-195, -165]
    angle_y_mid = (angle_y_range[0] + angle_y_range[1]) / 2

    x = 0.5 + (angle_x - angle_x_mid) / (angle_x_range[1] - angle_x_range[0])
    y = 0.5 + (angle_y - angle_y_mid) / (angle_y_range[1] - angle_y_range[0])

    x = max(min(x, 1), 0) * image.shape[1]
    y = max(min(y, 1), 0) * image.shape[0]

    return int(x), int(y)
