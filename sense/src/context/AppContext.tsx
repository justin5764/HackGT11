// src/context/AppContext.tsx

'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { UserInfo, VideoAnalysis } from '../types';

interface AppContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  videoAnalysis: VideoAnalysis | null;
  setVideoAnalysis: React.Dispatch<React.SetStateAction<VideoAnalysis | null>>;
  diagnosis: string;
  setDiagnosis: React.Dispatch<React.SetStateAction<string>>;
  suggestions: string;
  setSuggestions: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  psychiatricAnswers: string[];
  setPsychiatricAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  

}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', age: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [psychiatricAnswers, setPsychiatricAnswers] = useState<string[]>([]); // Initialize psychiatric answers


  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        videoFile,
        setVideoFile,
        videoAnalysis,
        setVideoAnalysis,
        diagnosis,
        setDiagnosis,
        suggestions,
        setSuggestions,
        error,
        setError,
        loading,
        setLoading,
        psychiatricAnswers,
        setPsychiatricAnswers,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};