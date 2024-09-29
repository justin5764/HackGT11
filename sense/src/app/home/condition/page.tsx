// src/app/page.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { UserInfo, VideoAnalysis, ApiResponse } from '../../../types'; // Adjust the import path as necessary

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
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
      emotionsDetected: ['impatient'], // You can change this to test different scenarios
      bodyLanguage: 'annoyed',
      audioTranscription: 'I am very impatient.',
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

    try {
      const analysisData = await analyzeVideo();
      setVideoAnalysis(analysisData);

      const response = await axios.post<ApiResponse>('/api/getConditionSuggestions', {
        userInfo,
        videoAnalysis: analysisData,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuggestions(response.data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('An unexpected error occurred while fetching suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
            className="border p-2 w-full my-2"
            value={userInfo.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border p-2 w-full my-2"
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
          className="rounded-full bg-blue-500 text-white px-6 py-2 mt-4 disabled:opacity-50"
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
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* ... Your existing footer links ... */}
      </footer>
    </div>
  );
}