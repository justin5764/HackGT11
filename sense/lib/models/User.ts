// src/lib/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IVideo {
  videoId: string;
  videoUrl: string;
}

export interface IUser extends Document {
  email: string;
  annualIncome: string;
  gender: string;
  race: string;
  age: string;
  priorMedicalHistory: string;
  insuranceInformation: string;
  phqScore: string;
  videos: IVideo[]; // Array of video objects
}

const VideoSchema: Schema = new Schema({
  videoId: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  annualIncome: { type: String, default: '' },
  gender: { type: String, default: '' },
  race: { type: String, default: '' },
  age: { type: String, default: '' },
  priorMedicalHistory: { type: String, default: '' },
  insuranceInformation: { type: String, default: '' },
  phqScore: { type: String, default: '' },
  videos: { type: [VideoSchema], default: [] }, // Store video objects
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
