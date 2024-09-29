// src/app/api/chatbot/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMessage, ChatResponse } from '../../../types'; // Adjust the path as necessary

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { messages, diagnosis } = (await req.json()) as {
      messages: ChatMessage[];
      diagnosis: string;
    };

    // Prepend the diagnosis to the conversation for context
    const systemPrompt = `You are a helpful assistant providing further questions and support based on the diagnosis: ${diagnosis}. Engage the user to gather more information or offer relevant advice.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseMessage = completion.choices?.[0]?.message?.content?.trim() || 'No response available.';

    return NextResponse.json({ message: responseMessage } as ChatResponse);
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Error processing chatbot message.' } as ChatResponse,
      { status: 500 }
    );
  }
}