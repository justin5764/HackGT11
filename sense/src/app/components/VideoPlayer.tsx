// src/components/VideoPlayer.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get('/api/get-video', {
          params: { id: videoId },
        });

        if (response.status === 200) {
          setVideoUrl(response.data.videoUrl);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <p>Loading video...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-md">
      <video controls src={videoUrl} className="w-full h-auto bg-gray-200"></video>
    </div>
  );
};

export default VideoPlayer;
