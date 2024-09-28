import cv2
from video_capture import start_video_capture
from emotion_detection import detect_emotions
from body_language import detect_body_language

def main():
    for frame in start_video_capture():
        # Body Language Detection
        # detect_body_language(frame)

        # Facial Emotion Detection
        emotions = detect_emotions(frame)
        
        if emotions:
            cv2.putText(frame, emotions, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 255, 0), 2, cv2.LINE_AA)

        # Show the final frame
        cv2.imshow('Real-time Analysis', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

if __name__ == '__main__':
    main()