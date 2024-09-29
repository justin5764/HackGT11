// src/app/components/NavBar.tsx

'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const NavBar = () => {
  const { user, error, isLoading } = useUser();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Sense
        </Link>
        <div>
          {isLoading && <div className="text-white">Loading...</div>}
          {error && <div className="text-red-500">Error: {error.message}</div>}
          {!isLoading && !user && (
            <Link href="/api/auth/login" className="text-white mr-4">
              Login
            </Link>
          )}
          {!isLoading && user && (
            <>
              <span className="text-white mr-4">Hello, {user.name}</span>
              <Link href="/api/auth/logout" className="text-white">
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;