// src/app/components/NavBar.tsx

'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const pathname = usePathname();

  const navLinks = [
    { name: 'User Info', path: '/user-info' },
    { name: 'Diagnosis', path: '/diagnosis' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'Map', path: '/map' },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Sense
        </Link>
        <div className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-gray-300 hover:text-white ${
                pathname === link.path ? 'underline' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isLoading && <div className="text-white">Loading...</div>}
          {error && <div className="text-red-500">Error: {error.message}</div>}
          {!isLoading && !user && (
            <Link href="/api/auth/login" className="text-white ml-4">
              Login
            </Link>
          )}
          {!isLoading && user && (
            <>
              <span className="text-white ml-4">Hello, {user.name}</span>
              <Link href="/api/auth/logout" className="text-white ml-2">
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