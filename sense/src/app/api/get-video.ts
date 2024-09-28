// pages/api/get-video.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Video from '../../../lib/models/Video';
import aws from 'aws-sdk';

// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch video metadata from MongoDB
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Generate a presigned URL for secure access
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: video.filename,
      Expires: 60 * 5, // URL expires in 5 minutes
    };

    const presignedUrl = s3.getSignedUrl('getObject', params);

    res.status(200).json({ videoUrl: presignedUrl, metadata: video });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
