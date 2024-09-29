// src/app/api/save-video-metadata/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Video from '../../../../lib/models/Video';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, filename, mimeType, fileSize } = await req.json();

    if (!videoUrl || !filename) {
      return NextResponse.json({ error: 'Missing videoUrl or filename' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Create a new Video document in MongoDB
    const newVideo = await Video.create({
      videoUrl,
      filename,
      mimeType: mimeType || 'video/webm',
      fileSize: fileSize || 0,
      // Add additional metadata fields as needed
    });

    return NextResponse.json({ message: 'Video metadata saved successfully', video: newVideo }, { status: 200 });
  } catch (error) {
    console.error('Error saving video metadata:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
