// src/app/api/getConditionSuggestions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; 
import { loadHealthConditions } from './healthConditions'; 
import { HealthCondition, VideoAnalysis, UserInfo, ApiResponse } from '../../../types'; 

const HEALTH_CONDITIONS: HealthCondition[] = loadHealthConditions();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userInfo, videoAnalysis } = (await req.json()) as {
      userInfo: UserInfo;
      videoAnalysis: VideoAnalysis;
    };

    console.log('Received userInfo:', userInfo);
    console.log('Received video analysis:', videoAnalysis);

    const symptoms = extractSymptomsFromAnalysis(videoAnalysis);
    console.log('Extracted Symptoms:', symptoms);

    const matchingConditions = findMatchingConditions(symptoms);
    console.log('Matching Conditions:', matchingConditions);

    if (matchingConditions.length === 0) {
      return NextResponse.json({
        suggestions: 'No matching health conditions found based on the provided data.',
      });
    }

    const prompt = generatePrompt(userInfo, videoAnalysis, matchingConditions);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const suggestions = completion.choices?.[0]?.message?.content?.trim() || 'No suggestions available.';

    return NextResponse.json({ suggestions } as ApiResponse);
  } catch (error) {
    console.error('Error fetching condition suggestions:', error);
    return NextResponse.json(
      { error: 'Error fetching condition suggestions' } as ApiResponse,
      { status: 500 }
    );
  }
}

const SYMPTOM_MAPPING: { [key: string]: string[] } = {
  sad: ['feeling sad', 'low mood', 'depression'],
  sadness: ['feeling sad', 'low mood', 'depression'],
  angry: ['anger', 'irritability', 'frustration'],
  mad: ['anger', 'irritability', 'frustration'],
  happy: ['euphoria', 'joy', 'elation'],
  anxious: ['anxiety', 'nervousness', 'worry'],
  slouched: ['poor posture', 'back pain'],
  'showing fists': ['aggression', 'hostility'],
  tears: ['tension', 'stress'],
  // Add more mappings as needed
};

// Helper function to extract symptoms from video analysis data
function extractSymptomsFromAnalysis(videoAnalysis: VideoAnalysis): string[] {
  const { emotionsDetected, bodyLanguage, audioTranscription } = videoAnalysis;

  const extractedSymptoms: string[] = [];

  // Map emotions to potential symptoms
  emotionsDetected.forEach((emotion) => {
    const lowerEmotion = emotion.toLowerCase();
    if (SYMPTOM_MAPPING[lowerEmotion]) {
      extractedSymptoms.push(...SYMPTOM_MAPPING[lowerEmotion]);
    } else {
      // If no mapping exists, use the emotion as a symptom
      extractedSymptoms.push(emotion);
    }
  });

  // Map body language to potential symptoms
  if (bodyLanguage) {
    const lowerBodyLanguage = bodyLanguage.toLowerCase();
    if (SYMPTOM_MAPPING[lowerBodyLanguage]) {
      extractedSymptoms.push(...SYMPTOM_MAPPING[lowerBodyLanguage]);
    } else {
      extractedSymptoms.push(bodyLanguage);
    }
  }

  // Extract keywords from audio transcription
  const transcriptionKeywords = extractKeywords(audioTranscription);
  extractedSymptoms.push(...transcriptionKeywords);

  // Remove duplicates
  return Array.from(new Set(extractedSymptoms));
}

// Simple keyword extraction from transcription


// Helper function to find matching conditions based on symptoms
function findMatchingConditions(symptoms: string[]): HealthCondition[] {
  return HEALTH_CONDITIONS.filter((condition: HealthCondition) =>
    condition.synonyms?.some((synonym: string) =>
      symptoms.some((symptom: string) =>
        symptom.toLowerCase().includes(synonym.toLowerCase()) ||
        synonym.toLowerCase().includes(symptom.toLowerCase())
      )
    )
  );
}

function extractKeywords(transcription: string): string[] {
  const keywords = [
    'headache',
    'fatigue',
    'nausea',
    'dizziness',
    'pains',
    'tired',
    'pissed',
    'frustrated',
    'anxious',
    'nervous',
    'worry',
    // Add more relevant keywords as needed
  ];
  return keywords.filter((keyword) => transcription.toLowerCase().includes(keyword));
}


// Helper function to generate the prompt for OpenAI
function generatePrompt(
  userInfo: UserInfo,
  videoAnalysis: VideoAnalysis,
  matchingConditions: HealthCondition[]
): string {
  return `
Based on the following user information and video analysis data, please provide possible health suggestions and potential diagnoses.

**User Information:**
- Name: ${userInfo.name}
- Age: ${userInfo.age}

**Video Analysis Data:**
- Emotions Detected: ${videoAnalysis.emotionsDetected.join(', ')}
- Body Language: ${videoAnalysis.bodyLanguage}
- Audio Transcription: "${videoAnalysis.audioTranscription}"

**Matching Health Conditions:**
${matchingConditions
  .map(
    (condition) => `- **${condition.name}**: ${condition.description || 'No description available.'}`
  )
  .join('\n')}

Please consider the above information to suggest possible health conditions and recommendations.
`;
}