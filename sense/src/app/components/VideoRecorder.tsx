// src/app/components/VideoRecorder.tsx

'use client';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const MAX_RECORDING_TIME = 300; // 5 minutes

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

      // Handle the stop event to prepare for playback and upload
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

        // Upload the video
        await uploadVideo(blob);
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

  // Function to upload video to S3 using presigned URL
  const uploadVideo = async (blob: Blob) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Request a presigned URL from the backend
      const generateResponse = await axios.post('/api/generate-presigned-url', {
        fileType: blob.type,
      });

      if (generateResponse.status !== 200) {
        throw new Error('Failed to generate presigned URL');
      }

      const { presignedUrl, fileUrl } = generateResponse.data;

      // Step 2: Upload the video directly to S3 using the presigned URL
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

      // Step 3: Save video metadata to MongoDB Atlas
      const saveResponse = await axios.post('/api/save-video-metadata', {
        videoUrl: fileUrl,
        filename: presignedUrl.split('/').pop(), // Extract filename from URL
        mimeType: blob.type,
        fileSize: blob.size,
      });

      if (saveResponse.status === 200) {
        console.log('Video metadata saved successfully:', saveResponse.data.video);
        alert('Video uploaded and saved successfully!');
        setDownloadURL(saveResponse.data.video.videoUrl); // Optional: Update state with saved video URL
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video.');

      // Optional: Provide more detailed error messages based on the response
      if (error.response && error.response.data && error.response.data.error) {
        setError(`Upload failed: ${error.response.data.error}`);
      } else {
        setError('Failed to upload video due to an unexpected error.');
      }
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
    </div>
  );
};

export default VideoRecorder;