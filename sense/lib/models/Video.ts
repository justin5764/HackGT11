// src/lib/models/Video.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVideo extends Document {
  userId?: string; // Made optional
  videoUrl: string;
  filename: string;
  createdAt: Date;
  title?: string;
  description?: string;
  tags?: string[];
  mimeType?: string;
  fileSize?: number;
  duration?: number;
  resolution?: string;
  privacy?: 'private' | 'public' | 'unlisted';
  // Add any additional metadata fields as needed
}

const VideoSchema: Schema = new Schema<IVideo>(
  {
    userId: { type: String, required: false }, // Changed to optional
    videoUrl: { type: String, required: true },
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    mimeType: { type: String },
    fileSize: { type: Number },
    duration: { type: Number },
    resolution: { type: String },
    privacy: { type: String, enum: ['private', 'public', 'unlisted'], default: 'private' },
    // Add any additional metadata fields here
  },
  { timestamps: true }
);

// Prevent model recompilation during hot reloads in development
const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
