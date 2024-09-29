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
  if (!userInfo.name || !userInfo.age) {
    router.push('/user-info');
    return null;
  }

  // Simulate video analysis (replace with real logic)
  const analyzeVideo = async () => {
    if (!videoFile) throw new Error('No video file uploaded.');

    // Simulating analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      emotionsDetected: ['worried'],
      bodyLanguage: 'shaking, anxiety',
      audioTranscription: 'I am very anxious and scared.',
    };
  };

  // Handle form submission to get condition suggestions
  const handleSubmit = async () => {
    if (!videoFile) {
      setError('Please record a video.');
      return;
    }

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