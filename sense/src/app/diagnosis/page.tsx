// src/app/diagnosis/page.tsx

'use client';

import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import VideoRecorder from '../components/VideoRecorder'; // Import VideoRecorder
import { UserInfo, VideoAnalysis, ApiResponse } from '../../types';

const DiagnosisPage = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const {
    userInfo,
    videoFile,
    setVideoFile,
    videoAnalysis,
    setVideoAnalysis,
    diagnosis,
    setDiagnosis,
    suggestions,
    setSuggestions,
    setError,
    setLoading,
    loading,
    error,
  } = context;

  // Redirect to User Info page if name or age is missing
  if (!userInfo.name || !userInfo.age) {
    router.push('/user-info');
    return null;
  }

  // Analyze Video by uploading to FastAPI
  const analyzeVideo = async (): Promise<VideoAnalysis> => {
    try {
      // Fetch the video from the public folder
      const response = await fetch('/test4.mp4');
      
      // Check if the fetch was successful
      if (!response.ok) {
        throw new Error('Failed to fetch the hardcoded video file.');
      }
      
      // Convert the response to a Blob
      const blob = await response.blob();
      
      // Create a File object from the Blob
      const hardcodedVideoFile = new File([blob], 'test4.mp4', { type: 'video/mp4' });
      
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', hardcodedVideoFile);
      
      // Upload the video to FastAPI backend
      const uploadResponse = await axios.post<VideoAnalysis>('http://0.0.0.0:8000/api/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return uploadResponse.data;
      
    } catch (error: any) {
      // Enhanced error logging
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to analyze video.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up request.');
      }
    }
  };

  // Handle form submission to get condition suggestions
  const handleSubmit = async () => {
    if (!userInfo.name || !userInfo.age) {
      setError('Please provide both name and age.');
      return;
    }

    // if (!videoFile) {
    //   setError('Please upload a video.');
    //   return;
    // }

    setLoading(true);
    setError('');
    setSuggestions('');
    setDiagnosis('');

    try {
      // Step 1: Upload and Analyze Video
      const analysisData = await analyzeVideo();
      setVideoAnalysis(analysisData);

      // Step 2: Fetch Condition Suggestions from FastAPI
      const response = await axios.post<ApiResponse>('http://0.0.0.0:8000/api/process-data', {
        userInfo,
        videoAnalysis: analysisData,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuggestions(response.data.suggestions);
        const primaryDiagnosis = response.data.suggestions
          .split('\n')[0]
          .replace(/^- \*\*(.*?)\*\*:.*/, '$1');
        setDiagnosis(primaryDiagnosis || '');
      }
    } catch (err: any) {
      console.error('Error fetching suggestions:', err.message);
      setError(err.message || 'An unexpected error occurred while fetching suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold mb-8">Complete Your Diagnosis</h1>

      {/* Video Recorder Section */}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Record Your Video</h2>
        <VideoRecorder />
        {videoFile && <p>Recorded File: {videoFile.name}</p>}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="rounded-full bg-blue-500 text-white px-6 py-2 mt-4 disabled:opacity-50 hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Get Condition Suggestions'}
      </button>

      {/* Display Condition Suggestions */}
      {suggestions && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Possible Conditions:</h2>
          <p className="whitespace-pre-line">{suggestions}</p>
        </div>
      )}

      {/* Display Error Messages */}
      {error && (
        <div className="mt-8 w-full max-w-md text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Informational Note */}
      {diagnosis && (
        <div className="mt-8 w-full max-w-md text-gray-600">
          <p>
            You can access the <strong>Chatbot</strong> and <strong>Treatment Map</strong> by clicking on the respective links in the top navigation bar.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiagnosisPage;