import numpy as np

points_3d = np.array([
    (0.0, 0.0, 0.0),             # Nose tip
    (0.0, -330.0, -85.0),        # Chin
    (-225.0, 170.0, -135.0),     # Left eye left corner
    (225.0, 170.0, -135.0),      # Right eye right corne
    (-150.0, -150.0, -125.0),    # Left Mouth corner
    (150.0, -150.0, -125.0)      # Right mouth corner
])

def get_headpose(landmarks, pnp_flags):
    pass

