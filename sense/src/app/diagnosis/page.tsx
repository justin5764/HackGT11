// src/app/diagnosis/page.tsx

'use client';

import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import VideoRecorder from '../components/VideoRecorder'; // Import VideoRecorder

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

  // Simulate video analysis (replace with real logic)
  const analyzeVideo = async () => {
    // If no video file, return the default analysis
    if (!videoFile) {
      return {
        emotionsDetected: ['worried'],
        bodyLanguage: 'shaking, anxiety',
        audioTranscription: 'I am very anxious and scared.',
      };
    }

    // Simulating analysis delay for the case when there is a video
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      emotionsDetected: ['worried'],
      bodyLanguage: 'shaking, anxiety',
      audioTranscription: 'I am very anxious and scared.',
    };
  };

  // Handle form submission to get condition suggestions
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuggestions('');
    setDiagnosis('');

    try {
      const analysisData = await analyzeVideo();
      setVideoAnalysis(analysisData);

      const response = await axios.post('/api/getConditionSuggestions', {
        userInfo,
        videoAnalysis: analysisData,
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
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('An unexpected error occurred while fetching suggestions.');
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
