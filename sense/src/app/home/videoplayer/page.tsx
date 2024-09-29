// pages/VideoPage.tsx or components/SomeComponent.tsx
"use client";
import React from 'react';
import VideoPlayer from '../../components/VideoPlayer'; // Adjust the path as needed

const VideoPage: React.FC = () => {
  // The videoId should match the video document in your MongoDB
  const videoId = '66f92eba9057e9231bd2f2a9'; // Example video ID

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Pass the videoId prop to the VideoPlayer */}
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

export default VideoPage;
