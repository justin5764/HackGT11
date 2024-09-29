// src/app/page.tsx

'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold">Welcome to Sense</h1>
      <p className="text-lg">Your personal healthcare companion.</p>
      <Link
        href="/user-info"
        className="rounded-full bg-blue-500 text-white px-6 py-3 mt-4 hover:bg-blue-600 transition"
      >
        Get Started
      </Link>
    </div>
  );
}