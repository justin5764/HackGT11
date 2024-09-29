// src/app/page.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 pb-20 sm:p-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-200 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-indigo-200 rounded-full blur-3xl"></div>

      {/* Hero Image */}
      <div className="relative w-full max-w-6xl mb-12">
        <Image
          src="/images/hero.jpg" // Ensure the image is placed correctly in public/images/
          alt="Healthcare Illustration"
          width={1920} // Increased width for larger display
          height={1080} // Adjusted height to maintain aspect ratio
          className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 filter blur-md"
        />
      </div>

      {/* Welcome Text */}
      <h1 className="text-5xl font-bold text-gray-800 mb-6 animate-fadeIn">
        Welcome to Sense
      </h1>
      <p className="text-xl text-gray-600 mb-8 animate-fadeIn delay-200">
        Your Personal Healthcare Companion
      </p>

      {/* Get Started Button */}
      <Link
        href="/user-info"
        className="relative inline-block text-lg font-semibold text-white px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 group"
      >
        Get Started
        <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}