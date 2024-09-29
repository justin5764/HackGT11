import React from 'react';
import Image from 'next/image';
import Navigation from '../components/navigation'

'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar: React.FC = () => {
  const { user, isLoading } = useUser();
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/upload" className="mr-4">
          Upload Videos
        </Link>
        {user && (
          <Link href="/profile" className="mr-4">
            Profile
          </Link>
        )}
      </div>
      <div>
        {!isLoading && !user && (
          <Link href="/api/auth/login" className="mr-4">
            Login
          </Link>
        )}
        {!isLoading && user && (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <Link href="/api/auth/logout">Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
