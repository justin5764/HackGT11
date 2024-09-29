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
        // Fetch the video from the API, passing the video ID
        const response = await axios.get('/api/get-video', {
          params: { id: videoId },
        });

        // Log the video URL (this is the presigned URL from AWS S3)
        console.log('Video URL:', response.data.videoUrl);

        // If the request is successful, set the video URL in the state
        if (response.status === 200) {
          setVideoUrl(response.data.videoUrl);
        }
      } catch (err) {
        console.error('Error fetching video:', err); // Log any errors
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
      {/* Render the video player with the fetched URL */}
      <video controls src={videoUrl} className="w-full h-auto bg-gray-200">
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
