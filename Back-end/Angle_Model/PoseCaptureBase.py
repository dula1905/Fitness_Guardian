import cv2
import mediapipe as mp
import time
import math
import numpy as np

# https://youtu.be/5kaX3ta398w?si=YOtjU44eG6Orq-xH Murtaza's Workshop
class poseDetector():

    def __init__(self, mode = False, modelComplex = 1, smooth = True, enableSeg = True, smoothSeg = True,
                 detectionCon = 0.5, trackCon = 0.5):

        self.mode = mode
        self.modelComplex = modelComplex
        self.smooth = smooth
        self.enableSeg = enableSeg
        self.smoothSeg = smoothSeg
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(self.mode, self.modelComplex, self.smooth, self.enableSeg, self.smoothSeg, self.detectionCon, self.trackCon)

    def findPose(self, img, draw = True):

        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)
        if self.results.pose_landmarks:
            if draw:
                self.mpDraw.draw_landmarks(img, self.results.pose_landmarks,
                                           self.mpPose.POSE_CONNECTIONS)

        return img

    def findPosition(self, img, draw = True):
        self.lmList = []

        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h, w, c = img.shape
                #print(id, lm)
                cx, cy = int(lm.x*w), int(lm.y*h)
                self.lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255,0,0), cv2.FILLED)
        return self.lmList

    # def findAngle_original(self, img, p1, p2, p3, draw = True):

    #     #Getting the Landmarks
    #     x1, y1 = self.lmList[p1][1:]
    #     x2, y2 = self.lmList[p2][1:]
    #     x3, y3 = self.lmList[p3][1:]

    #     # Check if any landmark is missing
    #     if None in [x1, y1, x2, y2, x3, y3]:
    #         return 0  # Return default value when any landmark is missing

    #     # Calculate the Angle
    #     angle = math.degrees(math.atan2(y3-y2, x3-x2)-math.atan2(y1 - y2, x1 - x2))

    #     # Ensure the angle is non-negative
    #     angle = abs(angle)
    #     # Round the angle to two decimal places
    #     angle = round(angle, 2)

    #     if angle < 0:
    #         angle += 360

    #     print(angle)

    #     if angle > 180.0:
    #          angle = 360-angle

    #     if draw:
    #         cv2.line(img, (x1,y1),(x2,y2), (0,0,255), 3)
    #         cv2.line(img, (x3,y3),(x2,y2), (0,0,255), 3)
    #         cv2.circle(img, (x1, y1), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x1, y1), 15, (255,0,0), 2)
    #         cv2.circle(img, (x2, y2), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x2, y2), 15, (255,0,0), 2)
    #         cv2.circle(img, (x3, y3), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x3, y3), 15, (255,0,0), 2)
    #         cv2.putText(img, str(int(angle)), (x2-50, y2+50),
    #                     cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)
            
    #     return angle  

    def findAngle(self, img, p1, p2, p3, draw=True):
        # Getting the Landmarks
        x1, y1 = self.lmList[p1][1:]
        x2, y2 = self.lmList[p2][1:]
        x3, y3 = self.lmList[p3][1:]

        # Check if any landmark is missing
        if None in [x1, y1, x2, y2, x3, y3]:
            return 0  # Return default value when any landmark is missing

        # Calculate vectors between points
        v1 = np.array([x1 - x2, y1 - y2])
        v2 = np.array([x3 - x2, y3 - y2])

        # Calculate dot product and magnitudes
        dot_product = np.dot(v1, v2)
        magnitude_v1 = np.linalg.norm(v1)
        magnitude_v2 = np.linalg.norm(v2)

        # Calculate cosine of the angle
        cosine_angle = dot_product / (magnitude_v1 * magnitude_v2)

        # Calculate angle in radians
        angle_rad = np.arccos(cosine_angle)

        # Convert angle to degrees
        angle_deg = np.degrees(angle_rad)

        # Ensure the angle is non-negative
        angle_deg = abs(angle_deg)

        # Round the angle to two decimal places
        angle_deg = round(angle_deg, 2)

        if draw:
            cv2.line(img, (x1,y1),(x2,y2), (0,0,255), 3)
            cv2.line(img, (x3,y3),(x2,y2), (0,0,255), 3)
            cv2.circle(img, (x1, y1), 10, (255,0,0), cv2.FILLED)
            cv2.circle(img, (x1, y1), 15, (255,0,0), 2)
            cv2.circle(img, (x2, y2), 10, (255,0,0), cv2.FILLED)
            cv2.circle(img, (x2, y2), 15, (255,0,0), 2)
            cv2.circle(img, (x3, y3), 10, (255,0,0), cv2.FILLED)
            cv2.circle(img, (x3, y3), 15, (255,0,0), 2)
            cv2.putText(img, str(int(angle_deg)), (x2-50, y2+50),
                        cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)
          
        return angle_deg
    
    def findDistance(self, img, p1, p2, draw=True):
        # Getting the Landmarks
        x1, y1 = self.lmList[p1][1:]
        x2, y2 = self.lmList[p2][1:]

        # Check if any landmark is missing
        if None in [x1, y1, x2, y2]:
            return None  # Return None when any landmark is missing

        # Calculate the Euclidean distance
        distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

        # Round the distance to two decimal places
        distance = round(distance, 2)

        if draw:
            cv2.line(img, (x1,y1),(x2,y2), (255,0,0), 3)
            cv2.circle(img, (x1, y1), 10, (255,0,0), cv2.FILLED)
            cv2.circle(img, (x1, y1), 15, (255,0,0), 2)
            cv2.circle(img, (x2, y2), 10, (255,0,0), cv2.FILLED)
            cv2.circle(img, (x2, y2), 15, (255,0,0), 2)
            cv2.putText(img, str(distance), ((x1+x2)//2-50, (y1+y2)//2+50),
                        cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)
        return distance

    # def findAngle(self, img, p1, p2, p3, draw=True):
    #     # Getting the Landmarks
    #     x1, y1 = self.lmList[p1][1:]
    #     x2, y2 = self.lmList[p2][1:]
    #     x3, y3 = self.lmList[p3][1:]

    #     # Check if any landmark is missing
    #     if None in [x1, y1, x2, y2, x3, y3]:
    #         return 0  # Return default value when any landmark is missing

    #     # Calculate vectors between points
    #     v1 = np.array([x1 - x2, y1 - y2])
    #     v2 = np.array([x3 - x2, y3 - y2])

    #     # Calculate the angle between the two vectors
    #     angle_rad = np.arctan2(v1[1], v1[0]) - np.arctan2(v2[1], v2[0])
    #     angle_deg = np.degrees(angle_rad)

    #     # Ensure angle is between 0 and 360 degrees
    #     angle_deg = angle_deg % 360

    #     # Ensure the angle is non-negative
    #     angle_deg = abs(angle_deg)

    #     # Round the angle to two decimal places
    #     angle_deg = round(angle_deg, 2)

    #     # Adjust angles for consistency
    #     if angle_deg > 180:
    #         angle_deg = 360 - angle_deg

    #     if draw:
    #         cv2.line(img, (x1,y1),(x2,y2), (0,0,255), 3)
    #         cv2.line(img, (x3,y3),(x2,y2), (0,0,255), 3)
    #         cv2.circle(img, (x1, y1), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x1, y1), 15, (255,0,0), 2)
    #         cv2.circle(img, (x2, y2), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x2, y2), 15, (255,0,0), 2)
    #         cv2.circle(img, (x3, y3), 10, (255,0,0), cv2.FILLED)
    #         cv2.circle(img, (x3, y3), 15, (255,0,0), 2)
    #         cv2.putText(img, str(int(angle_deg)), (x2-50, y2+50),
    #                     cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)
            
    #     # return angle   
    #     return angle_deg