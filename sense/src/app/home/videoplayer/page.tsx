"use client"
// pages/VideoPage.tsx or components/SomeComponent.tsx
import React from 'react';
import VideoPlayer from '../../components/VideoPlayer'; // Adjust the path as needed

const VideoPage: React.FC = () => {
  const videoId = '66f91ac0126c039f22018cee'; // The videoId you want to pass

  return (
    <div className="flex justify-center items-center h-screen">
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

export default VideoPage;
