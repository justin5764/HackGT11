// src/app/chatbot/page.tsx

'use client';

import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import Chatbot from '../../components/Chatbot';

const ChatbotPage = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const { diagnosis } = context;

  useEffect(() => {
    if (!diagnosis) {
      router.push('/diagnosis');
    }
  }, [diagnosis, router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-8 pb-20 sm:p-20 gap-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Chatbot Assistance</h1>

      {/* Chatbot Section */}
      <div className="w-full max-w-4xl bg-gray-50 p-6 rounded-lg shadow-md">
        {diagnosis ? (
          <Chatbot diagnosis={diagnosis} />
        ) : (
          <p className="text-gray-600">Initializing Chatbot...</p>
        )}
      </div>

      {/* Informational Note */}
      {diagnosis && (
        <div className="w-full max-w-4xl bg-yellow-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-700">
            Our <strong>Chatbot</strong> is here to provide personalized guidance and answer any questions you might have regarding your condition and treatment options. Navigate through the chat interface to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;