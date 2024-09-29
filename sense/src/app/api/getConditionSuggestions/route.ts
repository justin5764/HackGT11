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
 sad: ['feeling sad', 'low mood', 'depression', 'annoyed'],
 sadness: ['feeling sad', 'low mood', 'depression', 'annoyed'],
 angry: ['anger', 'irritability', 'frustration'],
 mad: ['anger', 'irritability', 'frustration'],
 happy: ['euphoria', 'joy', 'elation'],
 anxious: ['anxiety', 'nervousness', 'worry'],
 slouched: ['poor posture', 'back pain'],
 'showing fists': ['aggression', 'hostility'],
 tears: ['tension', 'stress'],
 frustrated: ['frustration', 'irritability', 'agitation'],
 nervous: ['anxiety', 'restlessness', 'unease'],
 calm: ['relaxation', 'peacefulness', 'serenity', 'peaceful', 'tranquil', 'serene'],
 excited: ['excitement', 'euphoria', 'enthusiasm'],
 bored: ['monotony', 'lack of interest', 'tedium', 'tedious', 'monotonous', 'uninterested'],
 scared: ['fear', 'panic', 'terror'],
 relaxed: ['calmness', 'tranquility', 'ease'],
 overwhelmed: ['stress', 'anxiety', 'pressure', 'burden'],
 content: ['satisfaction', 'happiness', 'pleasure'],
 fearful: ['fear', 'apprehension', 'dread'],
 hopeful: ['hope', 'optimism', 'expectation', 'confidence'],
 discouraged: ['demotivation', 'despair', 'discouragement'],
 lonely: ['isolation', 'solitude', 'separation'],
 confused: ['perplexity', 'bewilderment', 'uncertainty'],
 insecure: ['self-doubt', 'lack of confidence', 'vulnerability'],
 envious: ['jealousy', 'resentment', 'covetousness'],
 ashamed: ['embarrassment', 'humiliation', 'shame'],
 guilty: ['remorse', 'contrition', 'regret'],
 surprised: ['astonishment', 'amazement', 'shock'],
 delighted: ['joy', 'pleasure', 'satisfaction'],
 distressed: ['anguish', 'suffering', 'trouble'],
 resentful: ['bitterness', 'grudge', 'displeasure'],
 indifferent: ['apathy', 'lack of interest', 'unconcern'],
 melancholic: ['sadness', 'pensive', 'sorrowful'],
 pensive: ['thoughtfulness', 'reflection', 'contemplation'],
 regretful: ['remorse', 'sorrow', 'apology'],
 wary: ['caution', 'suspicion', 'distrust'],
 impatient: ['restlessness', 'agitation', 'irritability'],
 eager: ['enthusiasm', 'anticipation', 'interest'],
 terrified: ['fear', 'panic', 'horror'],
 panicked: ['fear', 'anxiety', 'dread'],
 horrified: ['shock', 'disgust', 'repulsion'],
 miserable: ['unhappiness', 'sorrow', 'distress'],
 distraught: ['agitation', 'emotional turmoil', 'distress'],
 agitated: ['restlessness', 'anxiety', 'irritability'],
 restless: ['inactivity', 'nervousness', 'anxiety'],
 jubilant: ['joy', 'elation', 'excitement'],
 ecstatic: ['euphoria', 'bliss', 'excitement'],
 serene: ['calmness', 'tranquility', 'peacefulness'],
 placid: ['calmness', 'peacefulness', 'stillness'],
 smug: ['self-satisfaction', 'complacency', 'arrogance'],
 tentative: ['hesitation', 'uncertainty', 'caution'],
 optimistic: ['hopefulness', 'positivity', 'confidence'],
 pessimistic: ['negativity', 'doubt', 'cynicism'],
 grumpy: ['irritability', 'bad mood', 'displeasure'],
 sullen: ['gloomy', 'morose', 'withdrawn'],
 solemn: ['seriousness', 'grave', 'stern'],
 dignified: ['poise', 'self-respect', 'grace'],
 assertive: ['confidence', 'decisiveness', 'self-assuredness'],
 defensive: ['protectiveness', 'resistance', 'self-protection'],
 deferential: ['respectfulness', 'submissiveness', 'courtesy'],
 jittery: ['nervousness', 'anxiety', 'trembling'],
 uneasy: ['discomfort', 'restlessness', 'anxiety'],
 unsure: ['uncertainty', 'doubt', 'hesitation'],
 nonchalant: ['indifference', 'casualness', 'detachment'],
 impulsive: ['spontaneity', 'rashness', 'hasty decisions'],
 preoccupied: ['distracted', 'absent-minded', 'engrossed'],
 smitten: ['infatuation', 'love', 'attraction'],
 indecisive: ['hesitation', 'uncertainty', 'doubt'],
 remorseful: ['regret', 'contrition', 'apology'],
 vengeful: ['resentment', 'grudge', 'retribution'],
 suspicious: ['distrust', 'caution', 'skepticism'],
 cynical: ['doubt', 'skepticism', 'mistrust'],
 dreamy: ['contemplative', 'pensive', 'imaginative'],
 contemplative: ['thoughtful', 'reflective', 'meditative'],
 sarcastic: ['irony', 'mocking', 'ridicule'],
 caustic: ['biting', 'scathing', 'harsh'],
 intense: ['passionate', 'extreme', 'forceful'],
 apathetic: ['indifferent', 'uninterested', 'passionless'],
 lethargic: ['sluggish', 'inactive', 'tired'],
 frenetic: ['wild', 'hectic', 'crazy'],
 manic: ['energetic', 'excited', 'hyperactive'],
 dejected: ['disheartened', 'downcast', 'miserable'],
 forlorn: ['lonely', 'desolate', 'sad'],
 despondent: ['hopeless', 'gloomy', 'discouraged'],
 appalled: ['horrified', 'shocked', 'disgusted'],
 bewildered: ['confused', 'puzzled', 'perplexed'],
 mortified: ['embarrassed', 'humiliated', 'ashamed'],
 oppressed: ['burdened', 'overwhelmed', 'stress'],
 rueful: ['regretful', 'sorrowful', 'contrite'],
 saddened: ['sad', 'unhappy', 'sorrowful'],
 shocked: ['astonished', 'stunned', 'amazed'],
 stressed: ['anxious', 'tense', 'overwhelmed'],
 tense: ['anxious', 'strained', 'stressed'],
 unsteady: ['wobbly', 'insecure', 'unstable'],
 upset: ['distressed', 'agitated', 'angry'],
 joyful: ['joy', 'happiness', 'elation'],
 irritated: ['annoyed', 'aggravated', 'exasperated'],
 disgusted: ['revulsion', 'loathing', 'repugnance'],
 enraged: ['extreme anger', 'fury', 'wrath'],
 desolate: ['loneliness', 'isolation', 'emptiness'],
 aggrieved: ['resentment', 'grief', 'sorrow'],
 disillusioned: ['cynicism', 'skepticism', 'pessimism'],
 exasperated: ['frustration', 'irritation', 'annoyance'],
 humbled: ['modesty', 'humility', 'meekness'],
 invigorated: ['energized', 'refreshed', 'rejuvenated'],
 petrified: ['terrified', 'frozen', 'paralyzed'],
 repentant: ['regretful', 'contrite', 'sorry'],
 rapturous: ['ecstatic', 'elated', 'overjoyed'],
 schadenfreude: ['malicious joy', 'gloating', 'taking pleasure'],
 stoic: ['emotionless', 'unyielding', 'impassive'],
 sympathetic: ['compassionate', 'empathetic', 'understanding'],
 tormented: ['suffering', 'agony', 'distress'],
 unperturbed: ['calm', 'composed', 'collected'],
 vigilant: ['alert', 'watchful', 'attentive'],
 wistful: ['yearning', 'longing', 'nostalgic'],
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
     extractedSymptoms.push(emotion.replace(/[^a-zA-Z ]/g, '').trim());
   }
 });


 // Map body language to potential symptoms
 if (bodyLanguage) {
   const lowerBodyLanguage = bodyLanguage.toLowerCase();
   if (SYMPTOM_MAPPING[lowerBodyLanguage]) {
     extractedSymptoms.push(...SYMPTOM_MAPPING[lowerBodyLanguage]);
   } else {
     extractedSymptoms.push(bodyLanguage.replace(/[^a-zA-Z ]/g, '').trim());
   }
 }


 // Extract keywords from audio transcription
 const transcriptionKeywords = extractKeywords(audioTranscription);
 const cleanedTranscriptionKeywords = transcriptionKeywords.map(keyword => keyword.replace(/[^a-zA-Z ]/g, '').trim());
 extractedSymptoms.push(...cleanedTranscriptionKeywords);


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
   'annoyed',
   'stress',
   'panic',
   'fear',
   'anger',
   'depression',
   'hopeless',
   'isolated',
   'overwhelmed',
   'gloomy',
   'confused',
   'sadness',
   'irrational',
   'restless',
   'agitated',
   'exhausted',
   'melancholic',
   'bitterness',
   'jealousy',
   'resentment',
   'embarrassed',
   'humiliated',
   'shame',
   'guilty',
   'apathy',
   'indifference',
   'boredom',
   'monotony',
   'loneliness',
   'anxiety',
   'panic',
   'trembling',
   'restlessness',
   'insecurity',
   'despair',
   'regret',
   'sad',
   'worried',
   'hesitant',
   'uncertain',
   'doubtful',
   'tension',
   'calm',
   'peaceful',
   'serene',
   'euphoria',
   'joy',
   'elation',
   'enthusiasm',
   'optimism',
   'positivity',
   'confident',
   'self-assured',
   'satisfied',
   'content',
   'relaxed',
   'tranquil',
   'pleasure',
   'satisfaction',
   'happiness',
   'bliss',
   'enthusiastic',
   'eager',
   'optimistic',
   'positivity',
   'joyful',
   'happiness',
   'elation',
   'excitement',
   'energetic',
   'excited',
   'hyperactive',
   'disheartened',
   'downcast',
   'miserable',
   'lonely',
   'desolate',
   'sad',
   'hopeless',
   'gloomy',
   'discouraged',
   'horrified',
   'shocked',
   'disgusted',
   'confused',
   'puzzled',
   'perplexed',
   'embarrassed',
   'humiliated',
   'ashamed',
   'burdened',
   'overwhelmed',
   'stress',
   'regretful',
   'sorrowful',
   'contrite',
   'sad',
   'unhappy',
   'sorrowful',
   'astonished',
   'stunned',
   'amazed',
   'anxious',
   'tense',
   'overwhelmed',
   'strained',
   'stressed',
   'wobbly',
   'insecure',
   'unstable',
   'distressed',
   'agitated',
   'angry',
   'peaceful',
   'tranquil',
   'serene',
   'ease',
   'calmness',
   'tranquility',
   'excitement',
   'euphoria',
   'enthusiasm',
   'joy',
   'happiness',
   'elation',
   'frustration',
   'irritability',
   'agitation',
   'annoyed',
   'aggravated',
   'exasperated',
   'revulsion',
   'loathing',
   'repugnance',
   'extreme anger',
   'fury',
   'wrath',
   // Add more relevant keywords as needed
   'agony',
   'betrayal',
   'compassion',
   'delirious',
   'eager',
   'fearful',
   'grief',
   'hope',
   'insecure',
   'joyous',
   'karma',
   'longing',
   'melancholy',
   'nostalgia',
   'oppression',
   'panic',
   'quiet',
   'rancor',
   'serenity',
   'torture',
   'unease',
   'vexation',
   'wariness',
   'xenophobia',
   'yearning',
   'zeal',
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
