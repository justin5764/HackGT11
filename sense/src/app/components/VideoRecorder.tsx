// components/VideoRecorder.tsx
import React, { useRef, useState, useEffect } from 'react';

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Reference to MediaRecorder
  const videoChunksRef = useRef<Blob[]>([]); // Stores recorded video chunks
  const [recording, setRecording] = useState<boolean>(false); // Recording state
  const [videoURL, setVideoURL] = useState<string | null>(null); // URL for playback
  const [error, setError] = useState<string>(''); // Error messages
  const MAX_RECORDING_TIME = 300; // Maximum recording time in seconds (5 minutes)

  // Feature detection on component mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support accessing media devices.');
    }

    if (!(window as any).MediaRecorder) {
      setError('MediaRecorder API is not supported in your browser.');
    }
  }, []);

  // Automatically stop recording after MAX_RECORDING_TIME
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

  // Clean up object URL on unmount or when videoURL changes
  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  // Function to start recording
  const startRecording = async () => {
    setError('');
    try {
      // Request access to the user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Set the live stream to the video element
        videoRef.current.play(); // Start playing the live stream
      }

      // Initialize MediaRecorder with the stream
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      // Collect video data chunks
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data); // Push data to the ref
        }
      };

      // Handle the stop event to prepare for playback
      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' }); // Create a Blob from the chunks
        const url = URL.createObjectURL(blob); // Generate a URL for the Blob
        setVideoURL(url); // Set the videoURL state for playback
        videoChunksRef.current = []; // Reset the video chunks

        if (videoRef.current) {
          videoRef.current.srcObject = null; // Remove the live stream
          videoRef.current.src = url; // Set the recorded video as the source
          videoRef.current.controls = true; // Enable playback controls
          videoRef.current.play(); // Start playing the recorded video
        }
      };

      mediaRecorder.start(); // Start recording
      mediaRecorderRef.current = mediaRecorder; // Store the MediaRecorder instance
      setRecording(true); // Update recording state
    } catch (err) {
      console.error('Error accessing media devices.', err);
      setError('Could not access camera and microphone. Please check permissions.');
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the MediaRecorder
      setRecording(false); // Update recording state
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all media tracks
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-semibold mb-4">Video Recorder</h2>
      <video
        ref={videoRef}
        className="w-full max-w-md h-auto bg-gray-200"
        controls
        muted={!videoURL} // Mute during recording, unmute during playback
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
      {videoURL && (
        <div className="mt-6 w-full max-w-md">
          <a
            href={videoURL}
            download="recording.webm"
            className="mt-2 inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
