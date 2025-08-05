import cv2
import numpy as np
import time
import PoseCaptureBase as pm
import joblib
import pandas as pd

# Load the trained model
clf = joblib.load('../Fitness_Guardian/bicep_curls/models/final_bicep_curl_model.pkl')

# For Video
# cap = cv2.VideoCapture("../Fitness_Guardian/Angle_Model/PoseVideos/bicep_curls_short.mp4")
# For Camera
cap = cv2.VideoCapture(0)

detector = pm.poseDetector()

def get_joint_angles(img, detector):
    angles = []
    lmList = detector.findPosition(img, False)
    if len(lmList) != 0:

        relbow_angle = detector.findAngle(img, 16, 14, 12, draw=True)
        lelbow_angle = detector.findAngle(img, 15, 13, 11, draw=True)
        rshoulderflex_angle = detector.findAngle(img, 14, 12, 24, draw=True)
        lshoulderflex_angle = detector.findAngle(img, 13, 11, 23, draw=True)
        rhip_angle = detector.findAngle(img, 12, 24, 26, draw=True)
        lhip_angle = detector.findAngle(img, 11, 23, 25, draw=True)

        # relbow_angle = 90.12
        # lelbow_angle = 90.77
        # rarmpit_angle = 48.22
        # larmpit_angle = 49.27
        # rhip_angle = 160.69
        # lhip_angle = 160.31
        # rknee_angle = 180.35
        # lknee_angle = 180.63
        # rankle_angle = 90
        # lankle_angle = 90

        angles.extend([relbow_angle, lelbow_angle, rshoulderflex_angle, lshoulderflex_angle, rhip_angle,
                       lhip_angle])

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
    #img = cv2.resize(img, (1288, 720))

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
    
    # Convert list of angles to array
    angles_array = np.array(angles)

    # Display the array
    print("Joint angles array:", angles_array)

    # Prepare input for model prediction

    custom_input = {
        'relbow': angles[0],
        'lelbow': angles[1],
        'rshoulderflex': angles[2],
        'lshoulderflex': angles[3],
        'rhip': angles[4],
        'lhip': angles[5]
    }

    # Convert dictionary to DataFrame
    custom_df = pd.DataFrame([custom_input])

    # Make predictions using the trained model
    prediction = clf.predict(custom_df)

    # Display the result on the image
    if prediction == 1:
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
