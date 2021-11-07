import cv2
import numpy as np

model_points = np.array([
    (0.0, 0.0, 0.0),             # Nose tip
    (0.0, -330.0, -85.0),        # Chin
    (-225.0, 170.0, -135.0),     # Left eye left corner
    (225.0, 170.0, -135.0),      # Right eye right corne
    (-150.0, -150.0, -125.0),    # Left Mouth corner
    (150.0, -150.0, -125.0)      # Right mouth corner
])

def get_headpose(image, landmarks, pnp_flag):
    size = image.shape
    focal_length = size[1]
    center = (size[1]/2, size[0]/2)
    camera_matrix = np.array(
        [[focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]], dtype = "double"
    )

    image_points = np.array([
        landmarks[30],     # Nose tip
        landmarks[8],     # Chin
        landmarks[36],     # Left eye left corner
        landmarks[45],     # Right eye right corne
        landmarks[48],     # Left Mouth corner
        landmarks[54]      # Right mouth corner
    ], dtype="double")

    dist_coeffs = np.zeros((4,1))

    ret, rvec, tvec = cv2.solvePnP(model_points, image_points, camera_matrix, dist_coeffs, flags=pnp_flag)
    if not ret: return None

    rvec = rvec.reshape(-1).tolist()
    tvec = tvec.reshape(-1).tolist()
    return (rvec, tvec)

