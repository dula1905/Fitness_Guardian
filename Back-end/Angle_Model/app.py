from flask import Flask, render_template, Response, session, jsonify, request, redirect, url_for
from flask_cors import CORS  # You'll need to install this: pip install flask-cors
import os
import cv2
import numpy as np
import PoseCaptureBase as pm
import joblib
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient

app = Flask(__name__)
# Add CORS support
CORS(app)
app.secret_key = os.urandom(24)

client = MongoClient("mongodb+srv://dulajkekulawala1905:k7SBZI5eGScMWmKH@cluster0.holbaoi.mongodb.net/")
db = client['FitnessGurdian']
users_collection = db['user']

# Load the trained models for push-ups and bicep curls
clf_bicep_curls = joblib.load('../Back-end/bicep_curls/models/final_bicep_curl_model.pkl')
clf_pushups = joblib.load('../Back-end/pushups/models/final_pushup_model_tune.pkl')
clf_squats = joblib.load('../Back-end/squats/models/final_squats_model_tune.pkl')

# For Camera
#cap = cv2.VideoCapture(0)

#Videos
cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/squat_demo.mp4")
#cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/pushUp42.mp4")
#cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/athleanx_correct.mp4")
#cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/next_workout_incorrect_pu.mp4")
#cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/bc_demo.mp4")
#cap = cv2.VideoCapture("../Back-end/Angle_Model/PoseVideos/bicep_curls_short.mp4")


detector = pm.poseDetector()

def get_joint_angles_bicep_curls(img, detector):
    angles = []
    lmList = detector.findPosition(img, False)
    if len(lmList) != 0:
        # Get joint angles for bicep curls
        relbow_angle = detector.findAngle(img, 16, 14, 12, draw=True)
        lelbow_angle = detector.findAngle(img, 15, 13, 11, draw=True)
        rshoulderflex_angle = detector.findAngle(img, 14, 12, 24, draw=True)
        lshoulderflex_angle = detector.findAngle(img, 13, 11, 23, draw=True)
        rhip_angle = detector.findAngle(img, 12, 24, 26, draw=True)
        lhip_angle = detector.findAngle(img, 11, 23, 25, draw=True)

        angles.extend([relbow_angle, lelbow_angle, rshoulderflex_angle, lshoulderflex_angle, rhip_angle,
                       lhip_angle])

    return angles

def get_joint_angles(img, detector):
    angles = []
    lmList = detector.findPosition(img, False)
    if len(lmList) != 0:
        # Get joint angles for push-ups
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

        angles.extend([relbow_angle, lelbow_angle, rarmpit_angle, larmpit_angle, rhip_angle,
                       lhip_angle, rknee_angle, lknee_angle, rankle_angle, lankle_angle])

    return angles

# Delay between frame captures in seconds
frame_delay = 0.0025

def generate_frames(exercise_type):
    while True:
        # Capture frame-by-frame
        ret, img = cap.read()
        if not ret:
            break

        # Mirror the image horizontally
        img = cv2.flip(img, 1)

        # Find pose
        img = detector.findPose(img, False)

        # Fix the conditional statement that was causing logical errors
        if exercise_type == 'bicep_curls':
            angles = get_joint_angles_bicep_curls(img, detector)
        elif exercise_type in ['pushups', 'squats']:
            angles = get_joint_angles(img, detector)
        else:
            # Default to pushups if exercise type is not recognized
            angles = get_joint_angles(img, detector)
            exercise_type = 'pushups'

        # Check if angles array is empty
        if not angles:
            print("No landmarks detected. Skipping prediction.")
            continue

        if exercise_type == 'squats':
            # Calculate distances
            rshoulder_to_lshoulder_distance = detector.findDistance(img, 12, 11, draw=False)
            rknee_to_lknee_distance = detector.findDistance(img, 26, 25, draw=False)
            rankle_to_lankle_distance = detector.findDistance(img, 28, 27, draw=False)

            # Check distance condition
            knee_distance_condition_met = rshoulder_to_lshoulder_distance <= rknee_to_lknee_distance
            ankle_distance_condition_met = rankle_to_lankle_distance < rknee_to_lknee_distance

        # Prepare input for model prediction
        if exercise_type == 'bicep_curls':
            custom_input = {
                'relbow': angles[0],
                'lelbow': angles[1],
                'rshoulderflex': angles[2],
                'lshoulderflex': angles[3],
                'rhip': angles[4],
                'lhip': angles[5]
            }
        elif exercise_type in ['pushups', 'squats']:
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

        # Determine which model to use based on the session variable
        if exercise_type == 'pushups':
            model = clf_pushups
        elif exercise_type == 'bicep_curls':
            model = clf_bicep_curls
        elif exercise_type == 'squats':
            model = clf_squats

        # Make predictions using the trained model
        prediction = model.predict(custom_df)

        # Display the result on the image
        if prediction == 1:
            if exercise_type == 'squats':
                if knee_distance_condition_met and ankle_distance_condition_met:
                    # Replace NaN values with 0 before drawing
                    angles = [angle if not np.isnan(angle) else 0 for angle in angles]
                    cv2.putText(img, "Correct Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                else:
                    # Replace NaN values with 0 before drawing
                    angles = [angle if not np.isnan(angle) else 0 for angle in angles]
                    cv2.putText(img, "Incorrect Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            else:
                # Replace NaN values with 0 before drawing
                angles = [angle if not np.isnan(angle) else 0 for angle in angles]
                cv2.putText(img, "Correct Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            # Replace NaN values with 0 before drawing
            angles = [angle if not np.isnan(angle) else 0 for angle in angles]
            cv2.putText(img, "Incorrect Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
        else:
            name = request.form.get('name')
            email = request.form.get('email')
            password = request.form.get('password')

        if not name or not email or not password:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'status': 'error', 'message': 'User already exists'}), 400

        hashed_password = generate_password_hash(password)
        users_collection.insert_one({'name': name, 'email': email, 'password': hashed_password})

        return jsonify({'status': 'success', 'message': 'User registered successfully'})
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form.get('email')
            password = request.form.get('password')

        user = users_collection.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            session['email'] = email
            return jsonify({'status': 'success', 'message': 'Logged in successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))


@app.route('/bicep_curls_instructions')
def bicep_curls():
    session['exercise_type'] = 'bicep_curls'  # Set session variable for Bicep Curls
    # Return JSON for API use and template for direct browser access
    if request.headers.get('Accept') == 'application/json':
        return jsonify({"status": "success", "exercise": "bicep_curls"})
    return render_template('bicep_curls_instructions.html')

@app.route('/push_ups_instructions')
def push_ups():
    session['exercise_type'] = 'pushups'  # Set session variable for Push Ups
    # Return JSON for API use and template for direct browser access
    if request.headers.get('Accept') == 'application/json':
        return jsonify({"status": "success", "exercise": "pushups"})
    return render_template('pushups_instructions.html')

@app.route('/squats_instructions')
def squats_instructions():
    session['exercise_type'] = 'squats'  # Set session variable for Squats
    # Return JSON for API use and template for direct browser access
    if request.headers.get('Accept') == 'application/json':
        return jsonify({"status": "success", "exercise": "squats"})
    return render_template('squats_instructions.html')

@app.route('/exercise_interface')
def exercise_interface():
    # Return JSON for API use and template for direct browser access
    if request.headers.get('Accept') == 'application/json':
        return jsonify({"status": "success"})
    return render_template('exercise_interface.html')

@app.route('/video_feed')
def video_feed():
    # Get exercise type from query param or session
    exercise_type = request.args.get('exercise', session.get('exercise_type', 'pushups'))
    return Response(generate_frames(exercise_type), 
                    mimetype='multipart/x-mixed-replace; boundary=frame')
                    

@app.route('/api/status')
def api_status():
    """Endpoint to check API status and current exercise"""
    return jsonify({
        "status": "online",
        "current_exercise": session.get('exercise_type', None)
    })

if __name__ == "__main__":
    from flask import request  # Import here to avoid circular import
    app.run(debug=True)