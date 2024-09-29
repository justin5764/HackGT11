// src/app/profile/page.tsx

'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';

const ProfilePage = () => {
  const { user, isLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        setProfile(response.data.user);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.error || 'Failed to load profile.');
      }
    };

    if (!isLoading && user) {
      fetchProfile();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {/* Display User Information */}
        <div className="space-y-2">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Annual Income:</strong> {profile.annualIncome || 'N/A'}</p>
          <p><strong>Gender:</strong> {profile.gender || 'N/A'}</p>
          <p><strong>Race:</strong> {profile.race || 'N/A'}</p>
          <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
          <p><strong>Prior Medical History:</strong> {profile.priorMedicalHistory || 'N/A'}</p>
          <p><strong>Insurance Information:</strong> {profile.insuranceInformation || 'N/A'}</p>
          <p><strong>PHQ Score:</strong> {profile.phqScore || 'N/A'}</p>
        </div>

        {/* List of Uploaded Videos */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Your Videos</h2>
          {profile.videos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {profile.videos.map((video: { videoId: string; videoUrl: string }, index: number) => (
                <li key={video.videoId}>
                  <Link href={`/video/${video.videoId}`} className="text-blue-500 underline">
                    Video {index + 1}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
