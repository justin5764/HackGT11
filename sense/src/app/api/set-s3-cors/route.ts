// src/app/api/set-s3-cors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const corsConfig = {
      CORSRules: [
        {
          AllowedOrigins: ['http://localhost:3000'],
          AllowedMethods: ['PUT', 'POST', 'GET'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
        },
      ],
    };

    const command = new PutBucketCorsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      CORSConfiguration: corsConfig,
    });

    await s3Client.send(command);

    return NextResponse.json({ message: 'CORS configuration set successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error setting CORS configuration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
