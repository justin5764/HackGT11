// src/app/page.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { UserInfo, VideoAnalysis, ApiResponse } from '../types';
import Chatbot from '../components/Chatbot';
import dynamic from 'next/dynamic';

// Dynamically import TreatmentMap with SSR disabled
const TreatmentMap = dynamic(() => import('../components/TreatmentMap'), { ssr: false });

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [diagnosis, setDiagnosis] = useState<string>(''); // To store the primary diagnosis
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const analyzeVideo = async (): Promise<VideoAnalysis> => {
    if (!videoFile) throw new Error('No video file uploaded.');

    // Simulating analysis. You can replace this with real analysis logic.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      emotionsDetected: ['angry'], // You can change this to test different scenarios
      bodyLanguage: 'fists, yelling',
      audioTranscription: 'I am very angry and pissed off.',
    };
  };

  const handleSubmit = async () => {
    if (!userInfo.name || !userInfo.age) {
      setError('Please provide both name and age.');
      return;
    }

    if (!videoFile) {
      setError('Please upload a video.');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions('');
    setDiagnosis('');

    try {
      const analysisData = await analyzeVideo();
      setVideoAnalysis(analysisData);

      const response = await axios.post<ApiResponse>('/api/getConditionSuggestions', {
        userInfo,
        videoAnalysis: analysisData,
      });

      // Type Narrowing using discriminated unions
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuggestions(response.data.suggestions);
        // Extract the primary diagnosis from the suggestions
        // This assumes that the diagnosis is mentioned at the beginning
        const primaryDiagnosis = response.data.suggestions.split('\n')[0].replace(/^- \*\*(.*?)\*\*:.*/, '$1');
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
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start w-full max-w-4xl">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* User Information Form */}
        <div className="my-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2 w-full my-2 rounded"
            value={userInfo.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border p-2 w-full my-2 rounded"
            value={userInfo.age}
            onChange={handleInputChange}
          />
        </div>

        {/* Video Upload */}
        <div className="my-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Video Upload</h2>
          <input
            type="file"
            accept="video/*"
            className="my-2"
            onChange={handleVideoUpload}
          />
          {videoFile && <p>Selected File: {videoFile.name}</p>}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="rounded-full bg-blue-500 text-white px-6 py-2 mt-4 disabled:opacity-50 hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Get Condition Suggestions'}
        </button>

        {/* Display Suggestions */}
        {suggestions && (
          <div className="mt-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Possible Conditions:</h2>
            <p className="whitespace-pre-line">{suggestions}</p>
          </div>
        )}

        {/* Display Error */}
        {error && (
          <div className="mt-8 w-full max-w-md text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Display Chatbot and Map Side by Side */}
        {diagnosis && (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Chatbot */}
            <div className="md:w-1/2">
              <Chatbot diagnosis={diagnosis} />
            </div>

            {/* Treatment Map */}
            <div className="md:w-1/2">
              <TreatmentMap diagnosis={diagnosis} />
            </div>
          </div>
        )}
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-16">
        {/* ... Your existing footer links ... */}
      </footer>
    </div>
  );
}