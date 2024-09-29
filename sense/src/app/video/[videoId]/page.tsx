// src/app/video/[videoId]/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import VideoPlayer from '../../components/VideoPlayer';
import ProtectedRoute from '../../components/ProtectedRoute';

interface VideoPageProps {
  params: {
    videoId: string;
  };
}

const VideoPage: React.FC<VideoPageProps> = ({ params }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold mb-4">Video Player</h1>
        <VideoPlayer videoId={params.videoId} />
      </div>
    </ProtectedRoute>
  );
};

export default VideoPage;
