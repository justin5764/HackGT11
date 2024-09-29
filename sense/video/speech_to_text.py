import whisper

video_path = 'PLACEHOLDER'

def main():
    model = whisper.load_model("base")
    result = model.transcribe(video_path, fp16=False, language="English")
    return result["text"]