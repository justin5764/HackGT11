import cv2
import mediapipe as mp
import numpy as np
import collections

# Initialize MediaPipe Pose
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Initialize video capture
video_path = 'PLACEHOLDER'  # Set your video file path here
cap = cv2.VideoCapture(video_path)

# Initialize a dictionary to keep track of body language counts
body_language_counts = collections.defaultdict(int)

# Function to calculate angle between three points
def calculate_angle(a, b, c):
    """
    Calculates the angle at point b given three points a, b, c.
    Points are in (x, y) format.
    """
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point

    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

# Function to calculate distance between two points
def calculate_distance(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

def main():
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Flip the frame horizontally for a selfie-view display
            frame = cv2.flip(frame, 1)

            # Convert the frame to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Process the frame with MediaPipe Pose
            results = pose.process(rgb_frame)

            # Convert back to BGR for OpenCV
            image = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)

            # Initialize body language label
            body_language = 'Neutral'

            if results.pose_landmarks:
                # Draw pose landmarks on the image
                mp_drawing.draw_landmarks(
                    image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                    mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                )

                landmarks = results.pose_landmarks.landmark

                # Define visibility threshold
                visibility_threshold = 0.5

                # Required landmarks for arms
                required_landmarks = [
                    mp_pose.PoseLandmark.LEFT_SHOULDER.value,
                    mp_pose.PoseLandmark.LEFT_ELBOW.value,
                    mp_pose.PoseLandmark.LEFT_WRIST.value,
                    mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
                    mp_pose.PoseLandmark.RIGHT_ELBOW.value,
                    mp_pose.PoseLandmark.RIGHT_WRIST.value
                ]

                # Check if all required landmarks are visible
                if all(landmarks[i].visibility > visibility_threshold for i in required_landmarks):
                    # Extract coordinates
                    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                    left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                    right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                                    landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                    right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
                                landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                    right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
                                landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

                    # Calculate angles at elbows
                    left_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
                    right_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)

                    # Get frame dimensions
                    frame_height, frame_width, _ = image.shape

                    # Convert normalized coordinates to pixel values
                    left_wrist_pixel = [int(left_wrist[0] * frame_width), int(left_wrist[1] * frame_height)]
                    right_wrist_pixel = [int(right_wrist[0] * frame_width), int(right_wrist[1] * frame_height)]
                    left_shoulder_pixel = [int(left_shoulder[0] * frame_width), int(left_shoulder[1] * frame_height)]
                    right_shoulder_pixel = [int(right_shoulder[0] * frame_width), int(right_shoulder[1] * frame_height)]

                    # Calculate distances between wrists and opposite shoulders
                    dist_left = calculate_distance(left_wrist_pixel, right_shoulder_pixel)
                    dist_right = calculate_distance(right_wrist_pixel, left_shoulder_pixel)

                    # Define relative thresholds based on frame size
                    cross_threshold = 0.5 * frame_width  # 10% of frame width
                    open_threshold = 0.3 * frame_width   # 30% of frame width

                    # Determine if arms are crossed
                    arms_crossed = False
                    if dist_left < cross_threshold and dist_right < cross_threshold:
                        arms_crossed = True

                    # Determine if arms are open
                    arms_open = False
                    if dist_left > open_threshold and dist_right > open_threshold:
                        arms_open = True

                    # Classification based on distances
                    if arms_crossed:
                        body_language = 'Closed Arms'
                        color = (0, 0, 255)  # Red
                    elif arms_open:
                        body_language = 'Open Arms'
                        color = (0, 255, 0)  # Green
                    else:
                        body_language = 'Neutral'
                        color = (255, 255, 0)  # Cyan

                    # Update body language counts
                    body_language_counts[body_language] += 1

                else:
                    # If required landmarks are not visible, default to Neutral
                    body_language = 'Neutral'
                    body_language_counts[body_language] += 1

                # Display body language label
                cv2.putText(image, f'Body Language: {body_language}', (50, 50), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2, cv2.LINE_AA)
            else:
                # If no pose landmarks are detected, assume hands are not showing
                body_language = 'Neutral'
                body_language_counts[body_language] += 1

                # Display body language label
                cv2.putText(image, f'Body Language: {body_language}', (50, 50), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2, cv2.LINE_AA)

            # Display the resulting frame
            # cv2.imshow('Body Language Detection', image)

            # Break the loop if 'q' key is pressed
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     print("Quit key pressed.")
            #     break

    # Release the webcam and close the window
    cap.release()
    cv2.destroyAllWindows()

    # Determine the Most Dominant Body Language
    if body_language_counts:
        dominant_body_language = max(body_language_counts, key=body_language_counts.get)
        print("\nBody Language Counts:")
        for bl, count in body_language_counts.items():
            print(f"{bl}: {count}")
        print(f"\nThe most dominant body language detected was: {dominant_body_language}")
    else:
        print("No body language was detected.")