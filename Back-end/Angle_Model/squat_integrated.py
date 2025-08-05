import cv2
import numpy as np
import time
import PoseCaptureBase as pm
import joblib
import pandas as pd

# Load the trained model
# clf = joblib.load('../Fitness_Guardian/generated_pushup_model_2.pkl')
clf = joblib.load('../Fitness_Guardian/squats/models/final_squats_model_tune.pkl')

# For Video
cap = cv2.VideoCapture("../Fitness_Guardian/Angle_Model/PoseVideos/squat_demo.mp4")
# For Camera
# cap = cv2.VideoCapture(0)

detector = pm.poseDetector()

def get_joint_angles(img, detector):
    angles = []
    lmList = detector.findPosition(img, False)
    if len(lmList) != 0:
        # Get joint angles
        relbow_angle = detector.findAngle(img, 16, 14, 12, draw=True)
        lelbow_angle = detector.findAngle(img, 15, 13, 11, draw=True)
        rarmpit_angle = detector.findAngle(img, 14, 12, 24, draw=True)
        larmpit_angle = detector.findAngle(img, 13, 11, 23, draw=True)
        rhip_angle = detector.findAngle(img, 12, 24, 26, draw=True)
        lhip_angle = detector.findAngle(img, 11, 23, 25, draw=True)
        rknee_angle = detector.findAngle(img, 24, 26, 28, draw=True)
        lknee_angle = detector.findAngle(img, 23, 25, 27, draw=True)
        rankle_angle = detector.findAngle(img, 26, 28, 32, draw=True)
        lankle_angle = detector.findAngle(img, 25, 27, 31, draw=True)

        # relbow_angle = 90.12
        # lelbow_angle = 90.77
        # rarmpit_angle = 48.22
        # larmpit_angle = 49.27
        # rhip_angle = 160.69
        # lhip_angle = 160.31
        # rknee_angle = 180.35
        # lknee_angle = 180.63
        # rankle_angle = 80
        # lankle_angle = 80

        angles.extend([relbow_angle, lelbow_angle, rarmpit_angle, larmpit_angle, rhip_angle,
                       lhip_angle, rknee_angle, lknee_angle, rankle_angle, lankle_angle])

    return angles

# Delay between frame captures in seconds
frame_delay = 0.01

while True:
    # Capture frame-by-frame
    ret, img = cap.read()
    if not ret:
        print("Failed to read frame")
        break
    
    # Resize image
    img = cv2.resize(img, (1288, 720))

    # Mirror the image horizontally
    img = cv2.flip(img, 1)
    
    # Find pose
    img = detector.findPose(img, False)
    
    # Get joint angles
    angles = get_joint_angles(img, detector)

    # Check if angles array is empty
    if not angles:
        print("No landmarks detected. Skipping prediction.")
        continue
    
    # Calculate distances
    rshoulder_to_lshoulder_distance = detector.findDistance(img, 12, 11, draw=False)
    rknee_to_lknee_distance = detector.findDistance(img, 26, 25, draw=False)
    rankle_to_lankle_distance = detector.findDistance(img, 28, 27, draw=False)

    # Convert list of angles to array
    angles_array = np.array(angles)

    # Display the array
    print("Joint angles array:", angles_array)

    # Prepare input for model prediction
    custom_input = {
        'relbow': angles[0],
        'lelbow': angles[1],
        'rarmpit': angles[2],
        'larmpit': angles[3],
        'rhip': angles[4],
        'lhip': angles[5],
        'rknee': angles[6],
        'lknee': angles[7],
        'rankle': angles[8],
        'lankle': angles[9]
    }

    # Convert dictionary to DataFrame
    custom_df = pd.DataFrame([custom_input])

    # Make predictions using the trained model
    prediction = clf.predict(custom_df)

    # Check distance condition
    knee_distance_condition_met = rshoulder_to_lshoulder_distance <= rknee_to_lknee_distance
    ankle_distance_condition_met = rankle_to_lankle_distance < rknee_to_lknee_distance

    # Display the result on the image
    if prediction == 1 and knee_distance_condition_met and ankle_distance_condition_met:
        cv2.putText(img, "Correct Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    else:
        cv2.putText(img, "Incorrect Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Display the frame
    cv2.imshow("Image", img)
    
    # Exit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    # Introduce delay between frames
    time.sleep(frame_delay)

# Release the capture
cap.release()
cv2.destroyAllWindows()
