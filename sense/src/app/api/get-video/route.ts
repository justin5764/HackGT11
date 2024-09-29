// src/app/api/get-video/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../lib/models/User';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    await dbConnect();

    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the video by videoId
    const video = user.videos.find((v: { videoId: string; }) => v.videoId === videoId);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ videoUrl: video.videoUrl }, { status: 200 });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
