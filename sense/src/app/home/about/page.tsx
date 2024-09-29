// src/app/upload/page.tsx

import ProtectedRoute from '../../components/ProtectedRoute';
import VideoRecorder from '../../components/VideoRecorder';

const UploadPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold mb-4">Upload Your Videos</h1>
        <VideoRecorder />
      </div>
    </ProtectedRoute>
  );
};

export default UploadPage;
