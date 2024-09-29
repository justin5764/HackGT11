// src/types.ts

export interface UserInfo {
  name: string;
  age: string;
}

export interface VideoAnalysis {
  emotionsDetected: string[];
  bodyLanguage: string;
  audioTranscription: string;
}

export interface HealthCondition {
  name: string;
  description?: string;
  synonyms?: string[];
}

export interface ApiResponse {
  suggestions: string;
  error: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message?: string;
  error?: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string; // Added 'type' property
}