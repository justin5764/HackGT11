import cv2

def start_video_capture():
    cap = cv2.VideoCapture(0)  # 0 for webcam or provide a path for video file

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        yield frame  # This will return frames for processing in other modules

        if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to quit
            break

    cap.release()
    cv2.destroyAllWindows()