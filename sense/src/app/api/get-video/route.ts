import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Video from '../../../../lib/models/Video';
import aws from 'aws-sdk';

// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch video metadata from MongoDB
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Extract the S3 key (filename) from the video URL
    const videoUrl = video.videoUrl;
    const url = new URL(videoUrl);
    const key = url.pathname.substring(1);  // Extract the key by removing the leading '/'

    // Generate a presigned URL for secure access to the video file
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,  // Use the extracted key
      Expires: 60 * 5,  // URL expires in 5 minutes
    };
    
    const presignedUrl = s3.getSignedUrl('getObject', params);

    // Send the presigned URL along with metadata if needed
    return NextResponse.json({ videoUrl: presignedUrl, metadata: video }, { status: 200 });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
