// src/app/map/page.tsx

'use client';

import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import TreatmentMap with SSR disabled
const TreatmentMap = dynamic(() => import('../../components/TreatmentMap'), { ssr: false });

const MapPage = () => {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nearby Treatment Centers</h1>

      {/* Treatment Map Section */}
      <div className="w-full max-w-4xl bg-gray-50 p-6 rounded-lg shadow-md">
        {diagnosis ? (
          <TreatmentMap diagnosis={diagnosis} />
        ) : (
          <p className="text-gray-600">Loading treatment centers...</p>
        )}
      </div>

      {/* Informational Note */}
      {diagnosis && (
        <div className="w-full max-w-4xl bg-yellow-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-700">
            Explore the <strong>Treatment Map</strong> to find nearby healthcare facilities that cater to your condition. For personalized assistance, interact with our <strong>Chatbot</strong> via the navigation bar.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPage;