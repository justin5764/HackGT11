// src/app/components/VideoRecorder.tsx

'use client';

import React, { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const MAX_RECORDING_TIME = 300; // 5 minutes

  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const { setVideoFile } = context;

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
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        videoRef.current.muted = true;
      }

      // Initialize MediaRecorder with the stream
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      // Collect video data chunks
      const videoChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          videoChunks.push(event.data);
        }
      };

      // Handle the stop event to prepare for playback
      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setVideoFile(file); // Update the global context with the recorded file
        const url = URL.createObjectURL(blob);
        setVideoURL(url);

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.controls = true;
          videoRef.current.muted = false;
          videoRef.current.play();
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

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-full max-w-md mb-4 bg-gray-200"
        controls
        muted={!videoURL}
        preload="auto"
      ></video>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="flex space-x-4 mt-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            aria-label="Start Recording"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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
            download="recorded-video.webm"
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