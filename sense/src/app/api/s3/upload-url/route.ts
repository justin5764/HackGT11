// src/app/api/s3/upload-url/route.ts

import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { getSession } from '@auth0/nextjs-auth0';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, fileType } = await req.json();

    // Generate a unique filename using UUID to prevent collisions
    const videoId = uuidv4();
    const uniqueFilename = `${videoId}-${filename}`;

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueFilename,
      Expires: 60, // URL valid for 60 seconds
      ContentType: fileType,
      ACL: 'public-read',
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
    const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    return NextResponse.json({ uploadURL, videoId, videoUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
