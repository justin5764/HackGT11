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

  // src/types.ts

export interface IVideo {
  videoId: string;
  videoUrl: string;
}

export interface IUser {
  email: string;
  annualIncome: string;
  gender: string;
  race: string;
  age: string;
  priorMedicalHistory: string;
  insuranceInformation: string;
  phqScore: string;
  videos: IVideo[];
}

  