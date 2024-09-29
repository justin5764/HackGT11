// src/app/api/generate-presigned-url/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const { fileType } = await req.json();

    if (!fileType) {
      return NextResponse.json({ error: 'Missing fileType' }, { status: 400 });
    }

    // Validate fileType format (e.g., should start with 'video/')
    if (!fileType.startsWith('video/')) {
      return NextResponse.json({ error: 'Invalid fileType' }, { status: 400 });
    }

    // Generate a unique filename
    const extension = fileType.split('/').pop() || 'webm';
    const uniqueFilename = `${uuidv4()}.${extension}`;

    // Initialize AWS S3 Client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Define S3 upload parameters
    const putObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueFilename,
      ContentType: fileType,
      ACL: 'private' as ObjectCannedACL, // Ensure correct type casting
    };

    // Create a PutObjectCommand
    const command = new PutObjectCommand(putObjectParams);

    // Generate the presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    // Construct the S3 file URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    return NextResponse.json({ presignedUrl, fileUrl }, { status: 200 });
  } catch (error: any) {
    // Detailed error logging
    console.error('Error generating presigned URL:', error);

    // Determine if the error is related to AWS credentials or permissions
    if (error.name === 'CredentialsProviderError') {
      return NextResponse.json(
        { error: 'Invalid AWS credentials. Please check your configuration.' },
        { status: 500 }
      );
    }

    if (error.name === 'ServiceInputError' || error.name === 'ServiceError') {
      return NextResponse.json(
        { error: 'AWS S3 Service Error. Please try again later.' },
        { status: 500 }
      );
    }

    // Fallback error message
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}