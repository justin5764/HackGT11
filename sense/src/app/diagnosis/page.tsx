'use client';

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import VideoRecorder from '../components/VideoRecorder'; // Import VideoRecorder
import { UserInfo, VideoAnalysis, ApiResponse } from '../../types';

const DiagnosisPage = () => {
  const context = useContext(AppContext);
  const router = useRouter();
  const [videoId, setVideoId] = useState<string | null>(null); // State to store MongoDB ID
  const [videoFile, setVideoFile] = useState<File | null>(null); // State to store the fetched video

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const {
    userInfo,
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

  // Function to fetch the video using the MongoDB ID
  const fetchVideoById = async (id: string) => {
    try {
      const response = await axios.get('/api/get-video', {
        params: { id }, // Use the MongoDB ID as the param
        responseType: 'blob', // Ensure we get the video as a Blob
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch the video.');
      }

      // Convert Blob to a File object
      const fetchedVideoFile = new File([response.data], 'recorded-video.mp4', { type: 'video/mp4' });
      setVideoFile(fetchedVideoFile); // Store the file in the state
    } catch (err: any) {
      console.error('Error fetching video:', err.message);
      setError(err.message || 'An unexpected error occurred while fetching the video.');
    }
  };

  // Automatically fetch the video when the videoId changes
  useEffect(() => {
    if (videoId) {
      fetchVideoById(videoId);
    }
  }, [videoId]);

  // Analyze Video by uploading to FastAPI
  const analyzeVideo = async (): Promise<VideoAnalysis> => {
    try {
      if (!videoFile) {
        throw new Error('No video file available for analysis.');
      }

      // Prepare FormData with the fetched video file
      const formData = new FormData();
      formData.append('file', videoFile);

      // Upload the video to FastAPI backend
      const uploadResponse = await axios.post<VideoAnalysis>('http://0.0.0.0:8000/api/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.data;
    } catch (error: any) {
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

    if (!videoFile) {
      setError('Please record or fetch a video first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions('');
    setDiagnosis('');

    try {
      // Step 1: Analyze Video
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
        <VideoRecorder onSaveMongoDBId={setVideoId} /> {/* Pass callback to VideoRecorder */}
        
        {videoId && (
          <div className="mt-4">
            <p className="text-gray-600">Video ID: {videoId}</p>
          </div>
        )}

        {videoFile && (
          <p className="mt-4 text-gray-600">
            <span className="font-medium">Fetched Video File:</span> {videoFile.name}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full max-w-md py-3 px-6 rounded-full text-white font-semibold ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } transition-colors duration-300 shadow-lg flex items-center justify-center`}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
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