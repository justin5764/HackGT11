import speech_recognition as sr

def transcribe_audio(file_path):
    recognizer = sr.Recognizer()

    with sr.AudioFile(file_path) as source:
        audio = recognizer.record(source)

        try:
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            print("Speech was unclear")
        except sr.RequestError:
            print("Error with the speech recognition service")
        return None