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
  if (!userInfo.name) {
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Diagnosis</h1>

      {/* Video Recorder Section */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Record Your Video</h2>
        <VideoRecorder />
        {videoFile && (
          <p className="mt-4 text-gray-600">
            <span className="font-medium">Recorded File:</span> {videoFile.name}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full max-w-md py-3 px-6 rounded-full text-white font-semibold ${
          loading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } transition-colors duration-300 shadow-lg flex items-center justify-center`}
        disabled={loading}
      >
        {loading ? (
          <>
            {/* Spinner SVG */}
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          'Get Condition Suggestions'
        )}
      </button>

      {/* Display Condition Suggestions */}
      {suggestions && (
        <div className="w-full max-w-2xl bg-green-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Possible Conditions:</h2>
          <p className="whitespace-pre-line text-gray-700">{suggestions}</p>
        </div>
      )}

      {/* Display Error Messages */}
      {error && (
        <div className="w-full max-w-2xl bg-red-50 p-6 rounded-lg shadow-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Informational Note */}
      {diagnosis && (
        <div className="w-full max-w-2xl bg-yellow-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-700">
            You can access the <strong>Chatbot</strong> and <strong>Treatment Map</strong> by clicking on the respective links in the top navigation bar.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiagnosisPage;
