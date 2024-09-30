import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

interface VideoRecorderProps {

  onSaveMongoDBId: (id: string) => void;

}



const VideoRecorder: React.FC<VideoRecorderProps> = ({ onSaveMongoDBId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [mongoDBId, setMongoDBId] = useState<string | null>(null); // New state to store MongoDB ID
  const MAX_RECORDING_TIME = 300; // 5 minutes

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support accessing media devices.');
    }

    if (!(window as any).MediaRecorder) {
      setError('MediaRecorder API is not supported in your browser.');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (recording) {
      timer = setTimeout(() => {
        stopRecording();
        alert('Maximum recording time reached.');
      }, MAX_RECORDING_TIME * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [recording]);

  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        videoRef.current.muted = true;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      const videoChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          videoChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(videoChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        mediaRecorderRef.current = null;

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.controls = true;
          videoRef.current.muted = false;
          videoRef.current.play();
        }

        // Upload the video and get the MongoDB ID
        const id = await uploadVideo(blob);
        if (id) {
          setMongoDBId(id); // Set the MongoDB ID in state
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      console.error('Error accessing media devices.', err);
      setError('Could not access camera and microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const uploadVideo = async (blob: Blob): Promise<string | null> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const generateResponse = await axios.post('/api/generate-presigned-url', {
        fileType: blob.type,
      });

      if (generateResponse.status !== 200) {
        throw new Error('Failed to generate presigned URL');
      }

      const { presignedUrl, fileUrl } = generateResponse.data;

      await axios.put(presignedUrl, blob, {
        headers: {
          'Content-Type': blob.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      const saveResponse = await axios.post('/api/save-video-metadata', {
        videoUrl: fileUrl,
        filename: presignedUrl.split('/').pop(),
        mimeType: blob.type,
        fileSize: blob.size,
      });

      if (saveResponse.status === 200) {
        const videoData = saveResponse.data.video;
        console.log('MongoDB ID:', videoData._id);
        return videoData._id; // Return the MongoDB ID
      }

      return null;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-semibold mb-4">Video Recorder</h2>
      <video
        ref={videoRef}
        className="w-full max-w-md h-auto bg-gray-200"
        controls
        muted={!videoURL}
        preload="auto"
      ></video>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="flex space-x-4 mt-4">
        {!recording && (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Start Recording"
          >
            Start Recording
          </button>
        )}
        {recording && (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            aria-label="Stop Recording"
          >
            Stop Recording
          </button>
        )}
      </div>
      {uploading && (
        <div className="mt-4 w-full max-w-md">
          <p>Uploading: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      {videoURL && (
        <div className="mt-6 w-full max-w-md">
          <a
            href={videoURL}
            download="recording.webm"
            className="mt-2 flex justify-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Download Video
          </a>
        </div>
      )}
      {mongoDBId && ( // Display MongoDB ID when available
        <div className="mt-4">
          <p>MongoDB Video ID: {mongoDBId}</p>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;