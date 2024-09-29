// src/types.ts

export interface HealthCondition {
    id: number;
    name: string;
    synonyms?: string[]; // Optional property
    symptoms?: string[]; // Additional property if needed
    description?: string; // Optional description
    // Add other relevant properties as needed
  }
  
  export interface VideoAnalysis {
    emotionsDetected: string[];
    bodyLanguage: string;
    audioTranscription: string;
  }
  
  export interface UserInfo {
    name: string;
    age: string; // Keeping as string to match initial state, can be converted to number if needed
  }
  
  export interface ApiResponse {
    suggestions: string;
    error?: string;
  }


export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message?: string;
  error?: string;
}
  