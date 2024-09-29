# python_service/main.py


from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
import whisper
import tempfile
import json
import collections


app = FastAPI()


# Enable CORS for all origins (adjust in production)
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],  # Change to your Next.js domain in production
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)


# Load Health Conditions
def load_health_conditions():
   with open('sense/python_service/healthConditions/healthConditions.json', 'r') as f:
       return json.load(f)


HEALTH_CONDITIONS = load_health_conditions()


# Initialize MediaPipe Pose
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


# Load Emotion Detection Model
EMOTION_MODEL_PATH = 'sense/python_service/models/face_model.h5'  # Update the path as needed
emotion_model = load_model(EMOTION_MODEL_PATH)
class_names = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']


# Initialize Whisper Model
whisper_model = whisper.load_model("base")


# Pydantic Models
class VideoAnalysis(BaseModel):
   emotionsDetected: List[str]
   bodyLanguage: List[str]
   audioTranscription: str


class UserInfo(BaseModel):
   name: str
   age: int


class RequestData(BaseModel):
   userInfo: UserInfo
   videoAnalysis: VideoAnalysis


class ResponseData(BaseModel):
   suggestions: Optional[str] = None
   error: Optional[str] = None


# Helper Functions
def extract_symptoms_from_analysis(video_analysis: VideoAnalysis) -> List[str]:
    symptoms = []
    emotions = video_analysis.emotionsDetected
    body_language = video_analysis.bodyLanguage
    transcription = video_analysis.audioTranscription

    # Map emotions to symptoms
    if 'Angry' in emotions or 'Disgusted' in emotions:
        symptoms.extend(['anger', 'irritability', 'frustration', 'stress'])
    if 'Sad' in emotions:
        symptoms.extend(['feeling sad', 'low mood'])
    if 'Fear' in emotions:
        symptoms.extend(['anxiety', 'fearfulness'])
    if 'Happy' in emotions:
        symptoms.extend(['contentment', 'happiness'])
    if 'Surprise' in emotions:
        symptoms.extend(['startle', 'alertness'])

    # Map body language to symptoms
    if 'crossed arms' in [bl.lower() for bl in body_language]:
        symptoms.extend(['tension', 'stress'])

    # Extract keywords from transcription
    transcription_keywords = extract_keywords(transcription)
    symptoms.extend(transcription_keywords)

    return list(set(symptoms))  # Remove duplicates


def extract_keywords(transcription: str) -> List[str]:
   keywords = ['headache', 'fatigue', 'nausea', 'dizziness', 'insomnia', 'chest pain']
   return [kw for kw in keywords if kw.lower() in transcription.lower()]


def find_matching_conditions(symptoms: List[str]) -> List[dict]:
   matching = []
   for condition in HEALTH_CONDITIONS:
       condition_synonyms = [syn.lower() for syn in condition.get('synonyms', [])]
       for symptom in symptoms:
           if symptom.lower() in condition_synonyms:
               matching.append(condition)
               break  # Avoid duplicate entries for the same condition
   return matching


def generate_suggestions(user_info: UserInfo, video_analysis: VideoAnalysis, matching_conditions: List[dict]) -> str:
   suggestions = ""
   if not matching_conditions:
       return 'No matching health conditions found based on the provided data.'


   suggestions += f"**User Information:**\n- Name: {user_info.name}\n- Age: {user_info.age}\n\n"
   suggestions += f"**Video Analysis Data:**\n- Emotions Detected: {', '.join(video_analysis.emotionsDetected)}\n"
   suggestions += f"- Body Language: {', '.join(video_analysis.bodyLanguage)}\n"
   suggestions += f"- Audio Transcription: \"{video_analysis.audioTranscription}\"\n\n"
   suggestions += "**Matching Health Conditions:**\n"
   for condition in matching_conditions:
       suggestions += f"- **{condition['name']}**: {condition.get('description', 'No description available.')}\n"


   return suggestions


# Video Analysis Function
def perform_video_analysis(video_path: str) -> VideoAnalysis:
   # Body Language Detection
   body_language_analysis = detect_body_language(video_path)


   # Emotion Detection
   emotion_counts = perform_emotion_detection(video_path)
   emotions_detected = [emotion for emotion, count in emotion_counts.items() if count > 0]


   # Audio Transcription
   audio_transcription = perform_audio_transcription(video_path)


   return VideoAnalysis(
       emotionsDetected=emotions_detected,
       bodyLanguage=body_language_analysis,
       audioTranscription=audio_transcription
   )


def detect_body_language(video_path: str) -> List[str]:
   # Initialize MediaPipe Pose
   with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
       cap = cv2.VideoCapture(video_path)
       body_language_counts = collections.defaultdict(int)


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


           # Initialize body language label
           body_language = 'Neutral'


           if results.pose_landmarks:
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
                   frame_height, frame_width, _ = frame.shape


                   # Convert normalized coordinates to pixel values
                   left_wrist_pixel = [int(left_wrist[0] * frame_width), int(left_wrist[1] * frame_height)]
                   right_wrist_pixel = [int(right_wrist[0] * frame_width), int(right_wrist[1] * frame_height)]
                   left_shoulder_pixel = [int(left_shoulder[0] * frame_width), int(left_shoulder[1] * frame_height)]
                   right_shoulder_pixel = [int(right_shoulder[0] * frame_width), int(right_shoulder[1] * frame_height)]


                   # Calculate distances between wrists and opposite shoulders
                   dist_left = calculate_distance(left_wrist_pixel, right_shoulder_pixel)
                   dist_right = calculate_distance(right_wrist_pixel, left_shoulder_pixel)


                   # Define relative thresholds based on frame size
                   cross_threshold = 0.1 * frame_width  # 10% of frame width
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
                       body_language = 'Crossed Arms'
                   elif arms_open:
                       body_language = 'Open Arms'
                   else:
                       body_language = 'Neutral'


                   # Update body language counts
                   body_language_counts[body_language] += 1


           else:
               # If no pose landmarks are detected, assume hands are not showing
               body_language = 'Neutral'
               body_language_counts[body_language] += 1


       cap.release()


       # Determine the most dominant body language
       if body_language_counts:
           dominant_body_language = max(body_language_counts, key=body_language_counts.get)
       else:
           dominant_body_language = 'Neutral'


       return [dominant_body_language]


def calculate_angle(a, b, c):
   # Calculate the angle between three points
   a = np.array(a)
   b = np.array(b)
   c = np.array(c)


   radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
             np.arctan2(a[1] - b[1], a[0] - b[0])
   angle = np.abs(radians * 180.0 / np.pi)


   if angle > 180.0:
       angle = 360 - angle


   return angle


def calculate_distance(point1, point2):
   return np.linalg.norm(np.array(point1) - np.array(point2))


def perform_emotion_detection(video_path: str) -> dict:
   face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
   cap = cv2.VideoCapture(video_path)
   emotion_counts = {emotion: 0 for emotion in class_names}


   while cap.isOpened():
       ret, frame = cap.read()
       if not ret:
           break


       # Convert to grayscale
       gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)


       # Detect faces
       faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))


       for (x, y, w, h) in faces:
           # Extract face ROI
           face_roi = frame[y:y + h, x:x + w]
           try:
               # Preprocess for the model
               face_image = cv2.resize(face_roi, (48, 48))
               face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
               face_image = keras_image.img_to_array(face_image)
               face_image = np.expand_dims(face_image, axis=0)
               face_image = np.expand_dims(face_image, axis=-1)
               face_image /= 255.0


               # Predict emotion
               predictions = emotion_model.predict(face_image)
               emotion_label = class_names[np.argmax(predictions)]
               emotion_counts[emotion_label] += 1
           except Exception as e:
               print(f"Emotion detection error: {e}")
               continue


   cap.release()
   return emotion_counts


def perform_audio_transcription(video_path: str) -> str:
   try:
       result = whisper_model.transcribe(video_path, fp16=False, language="English")
       return result["text"]
   except Exception as e:
       print(f"Audio transcription error: {e}")
       return ""


# API Endpoints
@app.post("/api/process-data", response_model=ResponseData)
def process_data(request_data: RequestData):
   try:
       user_info = request_data.userInfo
       video_analysis = request_data.videoAnalysis


       symptoms = extract_symptoms_from_analysis(video_analysis)
       print('Extracted Symptoms:', symptoms)


       matching_conditions = find_matching_conditions(symptoms)
       print('Matching Conditions:', matching_conditions)


       if not matching_conditions:
           return {"suggestions": 'No matching health conditions found based on the provided data.'}


       suggestions = generate_suggestions(user_info, video_analysis, matching_conditions)
       return {"suggestions": suggestions}


   except Exception as e:
       print('Error processing data:', e)
       return {"error": 'Error processing data.'}
  
@app.post("/api/upload-video", response_model=VideoAnalysis)
async def upload_video(file: UploadFile = File(...)):
   try:
       # Validate file type
       if not file.filename.endswith(".mp4"):
           raise HTTPException(status_code=400, detail="Invalid file type. Only MP4 videos are allowed.")


       # Save the uploaded video to a temporary file
       with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
           tmp.write(await file.read())
           tmp_path = tmp.name


       # Analyze the video
       video_analysis = perform_video_analysis(tmp_path)


       return video_analysis


   except HTTPException as he:
       print(f"Video upload error: {he.detail}")
       raise he
   except Exception as e:
       print(f"Video upload error: {e}")
       raise HTTPException(status_code=500, detail="Error processing the video.")


if __name__ == "__main__":
   import uvicorn
   uvicorn.run(app, host="0.0.0.0", port=8000)
