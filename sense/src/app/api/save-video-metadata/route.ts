// src/app/api/save-video-metadata/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../lib/models/User';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId, videoUrl, filename, mimeType, fileSize } = await req.json();

    if (!videoId || !videoUrl || !filename) {
      return NextResponse.json({ error: 'Missing videoId, videoUrl, or filename' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    const userEmail = session.user.email;
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await User.create({
        email: userEmail,
        videos: [{ videoId, videoUrl }],
        annualIncome: '',
        gender: '',
        race: '',
        age: '',
        priorMedicalHistory: '',
        insuranceInformation: '',
        phqScore: '',
      });
    } else {
      // Check if the user already has 3 videos
      if (user.videos.length >= 3) {
        return NextResponse.json({ error: 'Maximum of 3 videos allowed.' }, { status: 400 });
      }

      // Add the new video object to the user's videos array
      user.videos.push({ videoId, videoUrl });
      await user.save();
    }

    return NextResponse.json({ message: 'Video metadata saved successfully', user }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving video metadata:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
